# Feature Specification: CSS Optimization for First Contentful Paint

**Feature Branch**: `010-css-optimization`
**Created**: 2026-05-25
**Status**: Draft
**Input**: User description: "phase CSS Optimization (Medium Impact — FCP)"

## Clarifications

### Session 2026-05-25

- Q: Which pages should receive inlined critical CSS? → A: Only top-level static/marketing pages and their locale-prefixed variants (/, /tours, /about-us, /contact-us, /events, /make-your-trip, plus /fr, /fr/about-us, /de/contact-us, etc.). Dynamic pages (/tours/[id], /event/[id]) are excluded from per-page critical CSS generation in this phase and will be revisited if production RUM shows poor LCP/FCP on those routes.
- Q: What happens if CSS optimization exceeds the 30-second build time budget? → A: Build continues with a clear warning; skip the most expensive step (critical CSS extraction) while keeping cheaper optimizations (purging, deduplication, route splitting) active. Fallback priority: unused CSS purging → deduplication → route splitting → skip critical CSS. Build only fails on actual build errors, not on budget exceeded.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Critical CSS Inlined for Immediate First Paint (Priority: P1)

As a first-time visitor on any network (3G/4G/Wi-Fi), I want the visible above-the-fold content to paint immediately without waiting for external CSS files to download, so that I see a fully styled page faster on my first visit.

**Why this priority**: CSS files declared in the global `css` config and Tailwind's generated stylesheet are render-blocking resources. The browser must download and parse them before painting any pixels. Inlining the CSS required for above-the-fold content directly into the HTML `<head>` eliminates this render-blocking round-trip, yielding the largest FCP improvement among CSS optimization techniques. This is a medium-impact optimization as noted in the feature description.

**Independent Test**: Load the homepage on a throttled connection (Slow 3G in DevTools). Take a filmstrip screenshot of the first paint and compare to a baseline recorded before optimization. Visible styled content should appear measurably faster.

**Acceptance Scenarios**:

1. **Given** a visitor loads a static top-level page (/, /tours, /about-us, /contact-us, /events, /make-your-trip, or locale variants) for the first time, **When** the HTML response arrives, **Then** the `<head>` contains inline CSS sufficient to style all above-the-fold content (header, hero section, first visible cards/titles) without requiring any external CSS file download.
2. **Given** the full CSS stylesheet loads after the initial paint (asynchronously), **When** the page completes loading, **Then** all below-the-fold content and interactive elements are styled identically to the current production appearance — no visual discontinuity or missing styles.
3. **Given** a returning visitor loads a page (CSS cached from prior visit), **When** the page paints, **Then** no inline CSS is injected (the cached external stylesheet is sufficient), avoiding unnecessary HTML bloat.

---

### User Story 2 - Route-Level CSS Code Splitting (Priority: P2)

As a visitor navigating the site, I want only the CSS actually needed for the current page to be downloaded, so that pages without heavy components (e.g., Swiper carousels, booking widgets) don't pay the download and parse cost for CSS those components require.

**Why this priority**: Currently, Swiper CSS (5 files: base, pagination, navigation, free-mode, thumbs) and global SCSS are loaded on every page regardless of whether that page uses Swiper or those specific styles. Route-level CSS splitting ensures the Tours listing page only loads Swiper CSS, while the Contact Us page loads none. This reduces the CSS payload per page and improves FCP for Swiper-free pages.

**Independent Test**: Navigate to `/contact-us` (a page without Swiper) and verify via DevTools Network tab that no `swiper.css` files are fetched. Navigate to `/tours` and verify Swiper CSS loads on that route.

**Acceptance Scenarios**:

1. **Given** a visitor lands on `/contact-us` or `/about-us` (pages without carousels or booking forms), **When** the page loads, **Then** no Swiper CSS files appear in the network waterfall.
2. **Given** a visitor navigates from a static page to the Tours listing page (which uses Swiper), **When** the route changes, **Then** the required Swiper CSS files are fetched and the carousel renders correctly.
3. **Given** CSS is split by route, **When** a developer adds a new page, **Then** only the CSS imported by that page's components is included in the route's CSS bundle — no manual configuration required.

---

### User Story 3 - Unused CSS Removal from Global Stylesheets (Priority: P3)

As a developer and user, I want the global SCSS and Tailwind CSS output to contain only the styles actually used in the application, so that the total CSS footprint is minimized and download/parse time is reduced for every page.

**Why this priority**: Global SCSS files (`main.scss`, `responsive.scss`, `booking-success.scss`, `pagination.scss`) and Tailwind's utility classes may contain styles that are no longer referenced by any component. Purifying unused CSS reduces the total CSS size, benefiting all pages uniformly. This is lowest priority because Tailwind's JIT mode already removes unused utilities, but SCSS files and any leftover legacy styles may still carry dead code.

**Independent Test**: Run a CSS coverage audit in DevTools on the homepage. Compare total bytes of unused CSS before and after optimization. The unused bytes should decrease measurably.

**Acceptance Scenarios**:

1. **Given** the CSS build process runs, **When** the final CSS output is generated, **Then** no CSS rule is present in the output unless it matches at least one element or class that exists in the rendered application.
2. **Given** a developer accidentally references a CSS class that doesn't exist in any component, **When** the build completes, **Then** that class's styles are not present in the final CSS bundle.
3. **Given** the optimized CSS output, **When** the application is visually inspected across all 7 locales and all page templates, **Then** all pages render identically to the pre-optimization baseline.

---

### Edge Cases

- What happens if the critical CSS is generated during SSR but the page changes significantly on hydration (e.g., client-only components)? The critical CSS must cover the SSR-rendered state, and any post-hydration style differences must not cause a flash of unstyled content (FOUC).
- What happens if a page's critical CSS grows too large (>14KB — the typical TCP congestion window)? The inline CSS must be capped at 14KB; styles beyond this threshold must remain in the external stylesheet. Above-the-fold content that doesn't fit within the cap must still receive base layout styles (structural CSS takes priority over decorative).
- What happens on route transitions in the SPA? Route-level CSS injected on navigation must be cleaned up when navigating away (no accumulation of stale `<style>` tags in the DOM).
- What happens if a component is shared across multiple routes (e.g., the footer, header)? Shared component CSS must not be duplicated across route-level bundles — it should be in a common chunk loaded once.
- What happens with dynamic content loaded from the dashboard (tours, events, marketing pages)? CSS for dynamic content layouts must be in the global/common chunk, not route-specific, since the same layout component renders different data across multiple routes.
- What happens with third-party widget styles (TrustIndex, reCAPTCHA badge)? Third-party injected styles are not within the optimization scope — only application-authored CSS is targeted.
- What happens when critical CSS extraction exceeds the 30-second build time budget? The build continues with a warning; critical CSS extraction is skipped for remaining routes while cheaper optimizations (purging, deduplication, splitting) remain active. Static top-level pages are prioritized first for extraction, so the highest-impact pages should already have their critical CSS generated before the budget is exceeded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST inline critical above-the-fold CSS directly into the `<head>` of static top-level marketing pages (/, /tours, /about-us, /contact-us, /events, /make-your-trip and all supported locale-prefixed variants) during SSR, sufficient to style the viewport-visible content on first paint.
- **FR-011**: System MUST NOT generate per-page critical CSS for dynamic routes (/tours/[id], /event/[id]) in this phase — dynamic pages receive the shared optimized CSS bundles and benefit from general CSS cleanup (FR-007).
- **FR-002**: System MUST cap inline critical CSS at 14KB per page to avoid inflating HTML size beyond the TCP slow-start window.
- **FR-003**: System MUST load the full external CSS stylesheet asynchronously so it does not block rendering, and the full stylesheet must apply without visual regressions compared to the current production appearance.
- **FR-004**: System MUST skip critical CSS inlining when the browser has the full stylesheet cached from a prior visit (detected via a cookie or similar mechanism), falling back to the standard `<link rel="stylesheet">` path.
- **FR-005**: System MUST split CSS by route so that component-level CSS (e.g., Swiper carousel styles) is only loaded on routes that actually render those components.
- **FR-006**: System MUST extract CSS shared across multiple routes (header, footer, layout, common components) into a common chunk loaded on every page — shared CSS must not be duplicated across route bundles.
- **FR-007**: System MUST remove CSS rules from the final output that do not match any element, class, or ID present in the rendered application (unused CSS purging for both SCSS and Tailwind output).
- **FR-008**: System MUST preserve the visual appearance of all pages across all 7 locales (en, fr, de, it, pt, es, zh) — no visible styling regressions from any of the CSS optimization techniques.
- **FR-009**: System MUST NOT modify or optimize third-party CSS (Swiper library CSS, TrustIndex widget styles, reCAPTCHA badge styles) beyond splitting them to load only on routes that use them.
- **FR-010**: The CSS optimization build process MUST NOT increase build time by more than 30 seconds in production builds. If the budget would be exceeded, the system MUST emit a warning and skip critical CSS extraction (the most expensive step) while keeping cheaper optimizations (CSS purging, deduplication, route splitting) active; the build MUST NOT fail due to budget exceeded alone.

### Key Entities

- **Critical CSS**: A subset of CSS rules extracted per-page that covers all styles affecting elements within the initial viewport (above the fold). Generated at build time or during SSR. Capped at 14KB.
- **Route CSS Bundle**: A CSS file containing styles unique to a specific route's components. Loaded alongside the route's JavaScript when navigating.
- **Common CSS Chunk**: A shared CSS file containing styles for components used across multiple routes (layout, header, footer, shared UI primitives). Loaded on every page.
- **CSS Purging Manifest**: A list of CSS selectors that are safe to remove because no matching DOM element exists in any rendered page across all routes and locales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: First Contentful Paint (FCP) improves by at least 8% on the homepage as measured by the median of 5 Lighthouse mobile runs with simulated throttling, compared to the post-phase-009 baseline.
- **SC-002**: Total CSS transferred (uncompressed) on initial homepage load decreases by at least 30% compared to the current baseline.
- **SC-003**: The first paint of visible content on a Slow 3G connection is visually complete (above-fold elements styled) at least 500ms earlier than the baseline.
- **SC-004**: No page across all 7 locales shows visible styling regressions when compared side-by-side with the pre-optimization production site.
- **SC-005**: CSS coverage audit in DevTools shows unused CSS on the homepage is reduced to under 10% of total CSS bytes.
- **SC-006**: Route-level CSS splitting ensures pages without Swiper (Contact Us, About Us, Checkout) load zero bytes of Swiper CSS.
- **SC-007**: Build time increase from CSS optimization is 30 seconds or less in production builds (`npm run build`).

## Assumptions

- The Tailwind CSS JIT (Just-In-Time) mode is already active and removes unused Tailwind utility classes. This phase focuses on: (a) SCSS dead-code elimination in `main.scss`, `responsive.scss`, `booking-success.scss`, `pagination.scss`, and component-scoped `<style>` blocks; (b) critical CSS extraction; (c) route-level CSS splitting.
- The existing Nuxt 3 build pipeline (Vite) supports CSS code splitting natively for component-scoped styles — the work involves configuring and verifying this behavior and handling globally injected CSS (Swiper) that bypasses this mechanism.
- Critical CSS extraction will use build-time static extraction per route, not a third-party SaaS service or runtime injection.
- Swiper CSS files (5 imports in `nuxt.config.ts`) are the primary candidates for route-level splitting since they are currently loaded globally but only used on approximately 30-40% of pages.
- The 14KB critical CSS cap aligns with the TCP slow-start congestion window (standard practice for inlined resources).
- All 7 locales share the same CSS structure — locale-specific styling differences (RTL for Arabic, though /ar is excluded) are not a concern since Arabic is not in the i18n config.
- The existing `?no-third-party` query parameter has no effect on CSS delivery and is unrelated to this feature.
