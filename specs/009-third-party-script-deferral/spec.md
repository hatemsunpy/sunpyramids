# Feature Specification: Third-Party Script Deferral

**Feature Branch**: `009-third-party-script-deferral`
**Created**: 2026-05-24
**Status**: Draft
**Input**: User description: "Phase 9: Third-Party Script Deferral — delay all non-critical third-party scripts until user interaction to improve FCP and TBT"

## Clarifications

### Session 2026-05-24

- Q: How should the deferred plugin determine when to load TrustIndex scripts? → A: DOM-based detection. On idle, check whether known TrustIndex container elements (`#home-reviews`, `#footer-cert`, etc.) exist in the DOM. Load the corresponding TrustIndex script only when its container is present. On route changes, re-check after the new page renders. This keeps loading logic aligned with actual rendered content and avoids maintaining a separate route registry.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster First Contentful Paint by Deferring Analytics & Tracking Scripts (Priority: P1)

As a first-time visitor landing on any page, I want the page to paint visible content immediately without being blocked by third-party analytics, tracking, and captcha scripts that I don't directly interact with, so that the page loads perceptibly faster.

**Why this priority**: Google Tag Manager (GTM), Google Analytics (GA4), and reCAPTCHA Enterprise are currently loaded eagerly on every page — including during SSR — delaying the first contentful paint by executing non-critical JavaScript before the user sees any content. These scripts are essential for analytics and form security but are never needed for the initial render. Deferring them until after user interaction eliminates render-blocking third-party code from the critical path.

**Independent Test**: Open any page and verify via browser DevTools Performance tab that the initial render waterfall does not include googletagmanager.com or recaptcha/enterprise.js fetches. Form submissions with reCAPTCHA should still produce valid tokens.

**Acceptance Scenarios**:

1. **Given** a visitor loads any page for the first time, **When** the page's initial HTML and CSS are painted, **Then** no requests to `googletagmanager.com`, `google.com/recaptcha`, or `trustindex.io` are present in the network waterfall before the first paint completes.
2. **Given** a visitor submits a contact form that requires reCAPTCHA, **When** the form is submitted, **Then** a valid reCAPTCHA token is generated and the form submission succeeds identically to the current behavior.
3. **Given** the site is opened and the user does not interact within 5 seconds, **When** the 5-second timeout fires, **Then** all third-party analytics scripts load automatically without waiting for interaction.
4. **Given** the `?no-third-party` query parameter is present in the URL, **When** the page loads, **Then** no third-party scripts are loaded at all (neither eagerly nor deferred).

---

### User Story 2 - Deferred TrustIndex Reviews Widget Loading (Priority: P2)

As a user scrolling down to the reviews section on the homepage, event pages, and marketing pages, I want the TrustIndex reviews widget to load only when it is about to enter the viewport (or after page idle), so that its script doesn't compete with more critical content during initial page load.

**Why this priority**: The TrustIndex loader script is inserted on mount across 4+ components (homepage, events, event detail, footer certification, marketing pages). While individually lightweight, loading it immediately on mount adds script evaluation overhead during the critical rendering period. Deferring to idle or near-viewport yields TBT improvement with no user-visible difference since the widget is typically below the fold.

**Independent Test**: On the homepage, verify via DevTools that the TrustIndex loader script (`cdn.trustindex.io/loader.js`) is fetched after the page reaches idle or after user interaction, not during the initial page load waterfall.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the initial paint completes, **Then** the TrustIndex script has not yet been fetched from `cdn.trustindex.io`.
2. **Given** the TrustIndex widget has been deferred, **When** it eventually loads, **Then** the reviews widget renders identically to the current behavior — same styling, same star ratings, same count.
3. **Given** a visitor navigates to a page without a TrustIndex widget (e.g., a tour detail page), **When** the page loads, **Then** no TrustIndex script is fetched at all.

---

### User Story 3 - Centralized Deferred Script Plugin Architecture (Priority: P3)

As a developer maintaining the site, I want all third-party script loading logic to reside in a single, well-defined client-only plugin rather than being scattered across `nuxt.config.ts`, `app.vue`, and multiple component `onMounted` hooks, so that adding, removing, or modifying third-party scripts is straightforward and consistent.

**Why this priority**: Currently third-party scripts are loaded from three different locations: reCAPTCHA in `nuxt.config.ts` head scripts, GTM/GA4 in `app.vue` useHead(), and TrustIndex across 4+ components. This fragmentation makes it difficult to reason about load order, timing, and the `no-third-party` override. Consolidation into one plugin ensures consistent deferred loading behavior and simpler maintenance.

**Independent Test**: A developer can add a new third-party script by adding a single function call in one file, without touching any component, config, or layout files.

**Acceptance Scenarios**:

1. **Given** the deferred scripts plugin exists, **When** a developer needs to add a new third-party service (e.g., TikTok Pixel, Hotjar), **Then** they can add it by appending a function to the plugin without modifying any other file.
2. **Given** the `?no-third-party` query parameter is passed, **When** the plugin initializes, **Then** it exits early and none of the registered third-party scripts are loaded — consistent across all services.

---

### Edge Cases

- What happens if a user interacts with a form requiring reCAPTCHA before the deferred scripts have loaded? The reCAPTCHA composable must gracefully handle `grecaptcha` being undefined by initiating script load on demand rather than failing silently.
- What happens if a user has JavaScript disabled? The `<noscript>` GTM iframe in `app.vue` must be preserved for no-JS fallback tracking.
- What happens on slow connections where the 5-second timeout fires before interaction? The timeout must load scripts without interfering with ongoing page rendering (scripts use `async` + `defer`).
- What happens when reCAPTCHA fails to load? Form submissions must show a user-friendly error message (e.g., "Security verification unavailable, please try again") instead of a silent failure or broken state.
- What happens with multiple rapid page navigations (SPA)? The plugin must track whether scripts have already been loaded to avoid injecting duplicate `<script>` tags.
- What happens if the TrustIndex container has no reserved height and the widget loads after idle? To prevent CLS, the container element must have a reserved minimum height or aspect-ratio placeholder so the widget's late arrival does not shift layout.
- What happens if the DOM check runs before hydration completes? TrustIndex container detection must run after hydration to avoid DOM mismatch and ensure the container is part of the Vue-rendered tree, not a stale SSR node.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST defer loading of Google Tag Manager (GTM-KDF33T7) and Google Analytics (G-NKZ6W32C4J) scripts until the user's first interaction (scroll, click, touch, mouse movement, or key press) OR until a 5-second timeout, whichever occurs first.
- **FR-002**: System MUST defer loading of reCAPTCHA Enterprise (`recaptcha/enterprise.js`) until first user interaction or 5-second timeout.
- **FR-003**: System MUST defer loading of TrustIndex loader scripts (`cdn.trustindex.io`) using DOM-based detection: on page idle (via `requestIdleCallback` with a 5-second `setTimeout` fallback), check whether known TrustIndex container elements (e.g., `#home-reviews`, `#footer-cert`) exist in the DOM. Load the corresponding TrustIndex script only when its specific container is present. On client-side route changes, re-check for new containers after the new page renders.
- **FR-004**: System MUST load all deferred third-party scripts exactly once per page session — rapid SPA navigations must not inject duplicate `<script>` tags.
- **FR-005**: System MUST respect the existing `?no-third-party` query parameter: when present, no third-party scripts (eager or deferred) are loaded.
- **FR-006**: System MUST preserve the existing `<noscript>` GTM iframe for visitors with JavaScript disabled.
- **FR-007**: The reCAPTCHA composable (`composables/recapcha.js`) MUST detect when `grecaptcha` is not yet available and trigger immediate script loading rather than failing — ensuring forms remain functional even before the deferred load fires.
- **FR-008**: System MUST remove the reCAPTCHA script tag from the `nuxt.config.ts` head scripts configuration and relocate it to the deferred plugin.
- **FR-009**: System MUST remove the GTM/GA4 script block from `app.vue` `useHead()` and relocate it to the deferred plugin.
- **FR-010**: System MUST remove all `onMounted`-based TrustIndex script injections from individual components and relocate them to the deferred plugin.
- **FR-011**: System MUST handle reCAPTCHA load failures gracefully by surfacing a user-visible error message on the form that attempted submission.
- **FR-012**: The consolidated deferred scripts plugin MUST be a client-only Nuxt plugin (`.client` suffix) to avoid any server-side execution.

### Key Entities

- **Deferred Script Plugin**: A client-only Nuxt plugin that serves as the single entry point for all third-party script loading. Tracks load state (loaded/not-loaded), respects the `no-third-party` override, and exposes hooks for on-demand loading when scripts are needed before the deferred trigger fires.
- **Third-Party Script Registration**: Each registered script has a load function and an optional eager-load trigger (e.g., reCAPTCHA can be triggered on demand by form interaction before the deferred timeout).
- **TrustIndex Widget**: Three variants exist — homepage/events/event review stripe (`loader.js`), footer certification badge (`loader-cert.js`), and marketing page reviews. Each is identified by a container element ID.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Google Tag Manager and Google Analytics script requests are absent from the network waterfall during the initial page load (before user interaction or 5-second timeout).
- **SC-002**: reCAPTCHA Enterprise script request is absent from the initial page render waterfall.
- **SC-003**: TrustIndex script requests are absent from the initial page load waterfall on pages that include them.
- **SC-004**: First Contentful Paint (FCP) improves by at least 10% as measured by the median of 5 Lighthouse mobile runs with simulated throttling on the homepage.
- **SC-005**: Total Blocking Time (TBT) improves by at least 15% as measured by the median of 5 Lighthouse mobile runs with simulated throttling on the homepage.
- **SC-006**: All form submissions that require reCAPTCHA (Contact Us, Make Your Trip, Need Help, Event Booking) continue to produce valid tokens and submit successfully.
- **SC-007**: All TrustIndex review widgets (homepage, events, event detail, marketing pages, footer certification) render identically to their current appearance after deferred loading completes.
- **SC-008**: When `?no-third-party` is present in the URL, zero third-party script requests appear in the network tab.
- **SC-009**: No duplicate third-party script tags are injected during rapid SPA navigation between 5+ pages.
- **SC-010**: GTM `<noscript>` iframe fallback remains functional for visitors with JavaScript disabled.

## Assumptions

- The reCAPTCHA site key (`6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn`) and GTM/GA4 IDs (`GTM-KDF33T7`, `G-NKZ6W32C4J`) remain unchanged and are used as-is in the deferred plugin.
- The 5-second timeout is a reasonable fallback for analytics scripts — users who bounce within 5 seconds are unlikely to need tracking scripts to fire, and this timeout covers the majority of real user sessions.
- TrustIndex widgets are below the fold on all pages and deferring to `requestIdleCallback` will not cause visible layout shift when they eventually load.
- TikTok Pixel, Microsoft Clarity, and Hotjar are not currently active in the codebase but the centralized plugin will be structured to accommodate them via the `no-third-party` query param check in the existing code.
- No new third-party services are being added in this phase — the scope is limited to deferring existing scripts (GTM, GA4, reCAPTCHA, TrustIndex).
- The existing `?no-third-party` query parameter behavior is intentional and should be preserved as-is.
- Form submission flows that depend on reCAPTCHA will tolerate the additional latency of loading the reCAPTCHA script on demand when a user submits a form before the deferred trigger fires.
