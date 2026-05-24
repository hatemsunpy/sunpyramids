# Feature Specification: JavaScript Bundle Reduction

**Feature Branch**: `008-js-bundle-reduction`
**Created**: 2026-05-24
**Status**: Draft
**Input**: User description: "phase 8: JavaScript Bundle Reduction"

## Clarifications

### Session 2026-05-24

- Q: When a user switches the site language and the new locale file is being fetched asynchronously (lazy i18n), what should the UI show during that fetch? → A: Keep displaying the current language until the new locale is fully loaded, then swap atomically. No raw translation keys, no loading spinners. Debounce repeated language switch clicks while pending. If loading fails, keep current language and show a non-disruptive error only if needed. Preserve current route equivalent in the selected language.
- Q: Should this phase also include other low-effort bundle reduction items (duplicate Vercel Speed Insights module, datepicker CSS lazy-loading)? → A: Include both. Remove duplicate @vercel/speed-insights registration (keep one valid production-safe registration). Move datepicker CSS from global app.vue import to only the components/pages that use it, without causing layout shift or unstyled datepicker UI.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster Initial Page Load with Lazy i18n (Priority: P1)

As a visitor landing on any page of the site, I want only the locale messages for my current language to be loaded, so that the initial JavaScript download is smaller and the page becomes interactive sooner.

**Why this priority**: All 7 locale files (~156KB total) are currently loaded eagerly on every page regardless of the active language. Making i18n lazy eliminates ~130KB of non-active locale data from the initial bundle. This directly reduces Total Blocking Time (TBT) and improves Time to Interactive (TTI) for every page on the site.

**Independent Test**: Can be tested by loading any page and verifying only one locale file appears in the Network tab, rather than all 7 bundled into the initial JavaScript payload.

**Acceptance Scenarios**:

1. **Given** a visitor with browser language set to English, **When** the homepage loads, **Then** only the English locale messages are fetched in the initial page load.
2. **Given** a visitor browsing the site, **When** they navigate between pages, **Then** the active locale messages remain cached and are not re-fetched.
3. **Given** lazy i18n is enabled, **When** a visitor switches the site language, **Then** the current language remains visible while the new locale loads, and the UI atomically swaps to the new language once fully loaded — with no raw translation keys or layout shift visible.

---

### User Story 2 - No SSR Overhead from Client-Only Plugins (Priority: P2)

As a visitor on any page, I want the server-rendered HTML to arrive quickly without unnecessary JavaScript processing, so that the First Contentful Paint (FCP) is not delayed by plugins that only need to run in the browser.

**Why this priority**: The vue3-toastify plugin loads its JavaScript and CSS on both server and client during SSR, adding unnecessary work to the server render and bloating the client bundle. Making it client-only removes this overhead from the critical rendering path.

**Independent Test**: Verify that toast notifications still function correctly after the change and that the plugin's code is excluded from the server build output.

**Acceptance Scenarios**:

1. **Given** the toast plugin is marked client-only, **When** the server renders a page, **Then** the toast plugin code is excluded from the SSR bundle.
2. **Given** the toast plugin is client-only, **When** a user triggers a toast notification (e.g., form submission, error), **Then** the toast appears and functions identically to before.

---

### User Story 3 - Deduplicated Swiper CSS (Priority: P3)

As a visitor on pages using the Swiper carousel (homepage, tour pages), I want the Swiper CSS to load once globally instead of being duplicated across multiple component bundles, so that less redundant CSS is downloaded.

**Why this priority**: Swiper CSS (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`) is imported separately in 5+ Vue components. Each import adds the same CSS to that component's chunk. Moving to a single global import eliminates the duplication and reduces total CSS payload.

**Independent Test**: Verify that Swiper CSS is loaded exactly once in the page (check Network tab) and that all carousels/sliders render correctly on the homepage and tour pages.

**Acceptance Scenarios**:

1. **Given** Swiper CSS is imported globally, **When** any page with a Swiper carousel loads, **Then** the Swiper CSS is loaded once and all carousels display correctly.
2. **Given** the old per-component Swiper CSS imports are removed, **When** a page without any carousel loads, **Then** no unused Swiper CSS is loaded.

---

### User Story 4 - Clean Module Registration and Scoped CSS (Priority: P3)

As a visitor on any page, I want the application to avoid loading duplicate module registrations and unused CSS, so that the total page weight is as small as possible.

**Why this priority**: The `@vercel/speed-insights` module is registered twice in nuxt.config.ts, which may cause double initialization. The datepicker CSS (`@vuepic/vue-datepicker/dist/main.css`) is imported globally in app.vue but only used on booking/checkout pages. Fixing both removes unnecessary bytes from every page load with minimal risk.

**Independent Test**: Verify only one Speed Insights registration exists in the config, and verify the datepicker CSS is absent from pages that don't use a datepicker.

**Acceptance Scenarios**:

1. **Given** the module configuration, **When** inspected, **Then** `@vercel/speed-insights` appears exactly once.
2. **Given** a page without a datepicker (e.g., homepage), **When** loaded, **Then** the datepicker CSS is not included in the page's stylesheets.
3. **Given** a page with a datepicker (e.g., booking/checkout), **When** the datepicker is opened, **Then** it renders with correct styling and no layout shift.

---

### Edge Cases

- What happens when lazy i18n is enabled and a visitor has an unsupported browser language? The default locale (English) should load as a fallback without errors.
- What happens if the lazy locale fetch fails (network error, timeout)? The UI must keep the current language active and may show a non-disruptive error message; the page must not crash or show raw translation keys.
- What happens if a visitor rapidly clicks the language switcher while a locale is loading? Repeated language switch clicks must be debounced or disabled while a locale fetch is pending to prevent race conditions.
- What happens if the datepicker CSS is removed globally but a page using datepicker doesn't explicitly import it? The consuming components/pages must import the datepicker CSS directly so the datepicker renders with correct styling.
- What happens if Vercel Speed Insights double-initialization was masking a configuration issue? After removing the duplicate, the remaining single registration must be verified functional.
- What happens if a component that previously imported Swiper CSS no longer has the import but depends on Swiper styles being globally available? The global import in the Nuxt config ensures Swiper CSS is always available regardless of which page is visited.
- What happens if the toast plugin name change causes import resolution failures? The Nuxt plugin auto-registration resolves `.client.js` plugins correctly; the renamed file must be consistent with the updated nuxt.config.ts reference.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The i18n module MUST be configured with `lazy: true` so that only the active locale messages are loaded on initial page render.
- **FR-002**: Non-active locale files MUST NOT be included in the initial JavaScript bundle; they MUST load on demand when the user switches languages.
- **FR-002a**: During a language switch, the UI MUST keep displaying the current language until the new locale is fully loaded, then swap atomically. Raw translation keys MUST NOT be shown. Repeated language switch clicks MUST be debounced while a fetch is pending.
- **FR-002b**: If a locale fetch fails, the UI MUST retain the current language and MUST NOT crash. A non-disruptive error message may be shown.
- **FR-003**: The vue3-toastify plugin MUST be renamed to use the `.client.js` suffix so it is excluded from server-side rendering.
- **FR-004**: The nuxt.config.ts plugin reference for vue3-toastify MUST be updated to match the renamed file.
- **FR-005**: Swiper CSS imports (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`) MUST be moved to a single global entry in nuxt.config.ts.
- **FR-006**: All per-component `import "swiper/css"` (and sub-module) statements MUST be removed from individual Vue components.
- **FR-007**: All existing Swiper carousels (homepage main banner, tour detail gallery, travel blogs, partners, special offers) MUST render correctly after the CSS import change.
- **FR-008**: Toast notifications MUST continue to function identically after the plugin rename (form validation errors, success messages, etc.).
- **FR-009**: The duplicate `@vercel/speed-insights` module registration MUST be removed so that only one valid production-safe registration remains.
- **FR-010**: Vercel Speed Insights MUST continue to function correctly after the duplicate registration is removed.
- **FR-011**: The datepicker CSS (`@vuepic/vue-datepicker/dist/main.css`) MUST be removed from the global app.vue import.
- **FR-012**: The datepicker CSS MUST be imported only in the specific components or pages that use the datepicker (booking/checkout flows).
- **FR-013**: The datepicker UI MUST render with correct styling and no layout shift when opened after the CSS is scoped to its consuming components.

### Key Entities

- **Locale file**: A JSON file containing translated UI strings for a single language (e.g., `en.json`, `ar.json`). Seven locales exist in the project.
- **Client-only plugin**: A Nuxt plugin suffixed `.client.js` that executes only in the browser, not during server-side rendering.
- **Swiper CSS**: Third-party stylesheet modules required by the Swiper.js carousel library for pagination, navigation, and core styles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The initial JavaScript bundle size (total `_nuxt/` JS payload on homepage) is reduced by at least 20% compared to the baseline before changes.
- **SC-002**: Only one locale file is fetched during initial page load (verified by Network tab inspection showing a single locale JSON request).
- **SC-003**: The vue3-toastify plugin code is absent from the server build output.
- **SC-004**: All Swiper carousels across the site render and function identically to their pre-change behavior, with no visual regressions.
- **SC-005**: No build errors or warnings are introduced (`npm run build` completes successfully).
- **SC-006**: Total Blocking Time (TBT) on the homepage improves or remains stable (does not regress) compared to the current baseline.
- **SC-007**: ESLint passes with zero errors.
- **SC-008**: `@vercel/speed-insights` appears exactly once in the module configuration, and Speed Insights data collection functions correctly in production.
- **SC-009**: Pages without a datepicker do not include the datepicker CSS in their stylesheet payload (verified by browser dev tools inspection).

## Assumptions

- The `@nuxtjs/i18n` module supports lazy loading out of the box with the current version used in the project (Nuxt 3.15 compatible).
- Switching i18n to lazy mode does not break server-side rendering of translated content for SEO — the active locale still renders server-side; only inactive locales are deferred to client-side loading.
- The `.client.js` suffix convention is the standard Nuxt 3 mechanism for client-only plugins and is supported in the project's Nuxt version.
- Moving Swiper CSS to a global import does not change the specificity or cascade order of the styles, so no visual differences occur.
- No other plugins or modules depend on eager i18n loading (e.g., no server-side logic that requires all locale messages at once).
