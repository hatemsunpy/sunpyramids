# Feature Specification: Swiper CSS Deduplication & SSR Blocking Removal

**Feature Branch**: `011-swiper-css-ssr-fixes`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "remaining tasks in phase 10"

## Overview

This feature completes the remaining performance optimization work from Phase 010 (CSS Optimization). It addresses three distinct areas of technical debt that continue to impact build size, Time to First Byte (TTFB), and Total Blocking Time (TBT):

1. **Swiper CSS duplication** — The same Swiper CSS files are imported in 25+ components, inflating the bundle and causing redundant CSS evaluation.
2. **TrustIndex script blocking** — The homepage immediately injects a third-party review widget script during `onMounted`, bypassing the deferred loading strategy already implemented for all other third-party scripts.
3. **Header SSR blocking** — The site header awaits an API call for nationality data during server-side rendering, forcing every page request to wait for this data before responding.

## User Scenarios & Testing

### User Story 1 — Faster Homepage Load (Priority: P1)

As a visitor landing on the Sun Pyramids Tours homepage, I want the page to start rendering as quickly as possible without waiting for non-essential third-party scripts, so that I can interact with the core content sooner.

**Why this priority**: The homepage is the primary entry point for organic and paid traffic. Removing the immediate TrustIndex script injection directly improves both First Contentful Paint (FCP) and Total Blocking Time (TBT) for every new visitor.

**Independent Test**: Load the homepage in a clean browser session and verify (via DevTools Network tab) that the TrustIndex loader script does not appear in the first 5 seconds or before any user interaction.

**Acceptance Scenarios**:

1. **Given** a user opens the homepage with no prior session, **When** the page finishes initial render, **Then** no request to `cdn.trustindex.io/loader.js` is made for at least 5 seconds and only after user scroll/click/keyboard interaction or idle callback.
2. **Given** a user opens the homepage with `?no-third-party` query parameter, **When** the page renders, **Then** no TrustIndex script is loaded at all.

---

### User Story 2 — Consistent CSS Loading Across Pages (Priority: P2)

As a developer maintaining the codebase, I want Swiper CSS to be loaded centrally rather than duplicated across every component that uses Swiper, so that bundle size is reduced and style updates require changes in only one place.

**Why this priority**: While less visible to end users, this reduces CSS payload and simplifies maintenance. It also prevents CSS specificity conflicts that can arise from duplicate imports being evaluated at different component mount times.

**Independent Test**: Build the application and inspect the generated CSS bundles to confirm Swiper CSS is present exactly once in the global CSS, not repeated per-component.

**Acceptance Scenarios**:

1. **Given** a production build is generated, **When** inspecting the `_nuxt/` output CSS, **Then** `swiper/css`, `swiper/css/pagination`, and `swiper/css/navigation` content appears exactly once in the global styles.
2. **Given** any component that previously imported Swiper CSS directly, **When** reviewing its source code, **Then** no `import 'swiper/css...'` statements remain.

---

### User Story 3 — Unblocked Server-Side Rendering (Priority: P2)

As a visitor navigating to any page on the site, I want the server to respond immediately without waiting for optional form data (nationalities list) that I may never use, so that Time to First Byte (TTFB) is reduced on every page.

**Why this priority**: The nationality list is only needed when a user interacts with a booking or inquiry form. Blocking the entire SSR response for this data penalizes every page visit regardless of whether the user will ever open a form.

**Independent Test**: Request any page and verify via server logs or timing that the response is not gated on the nationality API call completing.

**Acceptance Scenarios**:

1. **Given** a server-side request for any page, **When** the HTML response is generated, **Then** the response completes without awaiting the nationalities API endpoint.
2. **Given** the page renders on the client, **When** the user opens a form that requires nationality selection, **Then** the nationality data is available (loaded client-side after hydration) and the dropdown populates correctly.

### Edge Cases

- What happens if Swiper releases a new CSS file that a component needs? → The component can import it directly, or it can be added to the global list if widely used.
- What happens if the TrustIndex container (`#home-reviews`) is dynamically created after page load (e.g., via tab switching)? → The plugin already watches for DOM changes and router navigations; it will detect the container and load the script.
- What happens if the nationalities API is slow or fails on the client? → The form dropdown should handle the loading state gracefully and show an empty or retry state.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST move Swiper CSS imports (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`) from individual components to the global CSS configuration so they are loaded once per application lifecycle.
- **FR-002**: After the global CSS change, no component SHOULD contain any `import 'swiper/css'` or `import 'swiper/css/...'` statements.
- **FR-003**: The homepage (`pages/index.vue`) MUST NOT immediately inject the TrustIndex script in `onMounted`. Instead, it MUST rely on the existing third-party script plugin to load TrustIndex after user interaction or idle callback.
- **FR-004**: The TrustIndex widget MUST still render correctly on the homepage after the deferred loading change.
- **FR-005**: The site header (`components/Header/index.vue`) MUST NOT `await` the `getnationalities()` call during server-side rendering.
- **FR-006**: Nationality data MUST still be available in the shared store for client-side form usage after the SSR blocking is removed.
- **FR-007**: The third-party script plugin MUST detect the `#home-reviews` DOM element and load TrustIndex after a user interaction or 5-second idle timeout, whichever comes first.
- **FR-008**: If the `?no-third-party` query parameter is present, no TrustIndex script SHOULD load.

### Key Entities

- **Swiper CSS Modules**: The three core Swiper stylesheet entry points (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`) currently duplicated across ~25 Vue components.
- **Third-Party Script Plugin** (`plugins/third-party-scripts.client.ts`): The existing client-only plugin that defers reCAPTCHA, GTM, GA4, and TrustIndex loading until user interaction.
- **Nationality Store** (`stores/sharedStore.js`): The Pinia store containing `getnationalities()` which fetches the list of countries for form dropdowns.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The production CSS bundle contains Swiper CSS content exactly once, not 25+ times.
- **SC-002**: Homepage FCP improves by at least 100ms on mobile (measured via Lighthouse) by removing the immediate TrustIndex script injection.
- **SC-003**: TTFB on the homepage improves by at least 50ms by removing the `await getnationalities()` SSR block.
- **SC-004**: Zero functional regressions — all Swiper carousels (tour cards, banners, galleries, related tours) render and behave identically before and after the change.
- **SC-005**: The TrustIndex reviews widget continues to render on the homepage within 10 seconds of page load under normal conditions.
- **SC-006**: The nationality dropdown in booking/inquiry forms continues to populate correctly on all client-side pages.

## Assumptions

- The `third-party-scripts.client.ts` plugin already correctly handles TrustIndex detection via router watchers and `requestIdleCallback`; only the competing immediate injection in `pages/index.vue` needs removal.
- All Swiper components use only the three CSS modules (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`); any additional Swiper CSS imports discovered during implementation should be added to the global list.
- The `getnationalities()` API endpoint is stable and the client-side fire-and-forget pattern does not risk race conditions with form usage (forms typically load after header hydration).
- No component is dynamically importing Swiper CSS in a way that would conflict with global static imports (e.g., conditional `await import('swiper/css')`).

## Scope

### In Scope

- Removing Swiper CSS imports from all Vue components
- Adding Swiper CSS to `nuxt.config.ts` `css` array
- Removing TrustIndex script injection from `pages/index.vue`
- Verifying TrustIndex still loads via the plugin
- Changing `await getnationalities()` to client-side only in `components/Header/index.vue`
- Verifying nationality dropdowns still work client-side

### Out of Scope

- Adding new Swiper features or changing carousel behavior
- Modifying the third-party script plugin itself (it already handles TrustIndex)
- Changing how nationalities are stored or cached
- Any other Phase 010 work already completed (critical CSS, i18n lazy loading, toastify client-only, etc.)

## Dependencies

- **Phase 009** (`third-party-script-deferral`): The `third-party-scripts.client.ts` plugin must already exist and correctly handle TrustIndex DOM detection and deferred loading.
- **Phase 008** (`js-bundle-reduction`): The `vue3-toastify.client.js` and lazy i18n configuration must remain intact.
- **Nuxt 3 Swiper module**: The `nuxt-swiper` module is already registered and provides the Swiper Vue components.
