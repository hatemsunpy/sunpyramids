# Feature Specification: PageSpeed Audit Remediation

**Feature Branch**: `012-performance-followup`
**Created**: 2026-06-04
**Status**: Draft
**Input**: Lighthouse mobile audit on `https://sunpyramids.vercel.app/` — score 42/100 with 62 scripts, 9.3s LCP, 890ms TBT

## Clarifications

### Session 2026-06-04

- **Q**: The Lighthouse audit shows 62 scripts loading on a single page. Should we focus only on the homepage or apply optimizations site-wide?  
  **A**: Apply site-wide. The homepage is the primary benchmark, but the same component patterns (tour cards, carousels, shared libraries) exist across all pages. A homepage-only fix would leave the rest of the site slow.
- **Q**: Should we convert all images to WebP/AVIF, or only those above a certain size threshold?  
  **A**: Convert all local photo-like images to WebP at quality 80. Serve AVIF only if the conversion pipeline supports it with fallback. Simple icons and flat graphics should prefer SVG. API-sourced images from the backend CDN should use `NuxtImg` with responsive `srcset` and format auto-negotiation where possible.
- **Q**: The audit flagged 3 font files as potentially render-blocking. Which fonts are these and are they all critical?  
  **A**: The project uses "Trip Sans" as the primary brand font (3 weights: Regular, Medium, Bold). All three are critical for brand identity and must be preloaded. Any additional third-party fonts (e.g., Google Fonts, icon fonts) should be audited and non-critical ones deferred.
- **Q**: Third-party script deferral was addressed in Phase 009. Why is it still flagged?  
  **A**: Phase 009 deferred TrustIndex and analytics scripts. The audit suggests there may be additional non-critical scripts (chat widgets, social embeds, heatmap tools, additional trackers) that still load eagerly. A full inventory and deferral of anything below-the-fold or non-critical is needed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Faster Page Load with Fewer Scripts (Priority: P1)

As a visitor on a mobile device with a slow connection, I want the page to load only the JavaScript it actually needs, so that the page becomes interactive sooner and I don't waste data on unused code.

**Why this priority**: 62 scripts on a single page is extremely high. Each script requires a network request, parsing, and execution. Reducing the initial JS payload directly improves FCP, LCP, and TBT — the three metrics currently flagged as "Poor".

**Independent Test**: Load the homepage with Chrome DevTools throttled to "Fast 3G" and count the number of JS requests in the Network tab. Before the fix: ~62. After: target <25.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page initializes, **Then** only JavaScript required for above-the-fold content and core navigation is loaded eagerly. Below-the-fold and page-specific code loads on demand.
2. **Given** a visitor scrolls down the homepage, **When** a below-the-fold component enters the viewport, **Then** its associated JavaScript chunk loads lazily without causing layout shift or blocking interaction.
3. **Given** a visitor navigates to a tour detail page, **When** the page loads, **Then** tour-specific logic (gallery lightbox, booking form) loads separately from the shared homepage bundle.

---

### User Story 2 — Responsive Image Delivery (Priority: P1)

As a visitor on any device, I want images to be served in an appropriate size and modern format, so that they load quickly without sacrificing visual quality.

**Why this priority**: Lighthouse flagged "Serves images with low resolution" and "Improve image delivery" both at score 0. Images are likely the largest contributor to the 2.9 MB total page weight and the 9.3s LCP.

**Independent Test**: Inspect any hero banner or tour card image with DevTools. Verify it is served as WebP (or AVIF), at a resolution close to its rendered size, and with a `srcset` providing smaller variants for mobile.

**Acceptance Scenarios**:

1. **Given** a hero banner image on the homepage, **When** it is requested by the browser, **Then** it is served in WebP format (or AVIF with WebP fallback) at a resolution appropriate for the viewport.
2. **Given** a tour card image rendered at 400×300 px on mobile, **When** the image is loaded, **Then** the browser receives a file close to that resolution, not a 2000×1500 px original.
3. **Given** a visitor on a high-DPI (Retina) display, **When** an image loads, **Then** the `srcset` provides a 2× density variant so the image remains sharp.

---

### User Story 3 — No Invisible Text During Font Load (Priority: P2)

As a visitor landing on the site, I want text to appear immediately in a fallback font while the brand font loads, so that I don't stare at blank text during the first few seconds.

**Why this priority**: Unpreloaded font files cause FOIT (Flash of Invisible Text) or FOUT (Flash of Unstyled Text), both of which hurt perceived performance and can delay LCP if text elements are the LCP target.

**Independent Test**: Load the homepage with DevTools Network throttling set to "Slow 3G". Observe whether any text is invisible during the first 2–3 seconds.

**Acceptance Scenarios**:

1. **Given** the homepage loads on a slow connection, **When** the brand font is still downloading, **Then** text renders immediately in a system fallback font (`font-display: swap`).
2. **Given** the Trip Sans font files are in the `<head>`, **When** the HTML is parsed, **Then** the critical weights (Regular, Medium, Bold) are preloaded with `<link rel="preload" as="font" crossorigin>`.
3. **Given** the font finishes loading, **When** it is applied, **Then** the swap is smooth and does not cause layout shift above 0.05 CLS.

---

### User Story 4 — Non-Critical Scripts Load Only When Needed (Priority: P2)

As a visitor on any page, I want analytics, chat widgets, and social embeds to load only after the core content is visible and interactive, so that they don't delay the page I came to see.

**Why this priority**: Even after Phase 009, the audit flagged render-blocking behavior and high TBT. Additional third-party scripts (live chat, remarketing pixels, social widgets, review embeds) may still be loading eagerly.

**Independent Test**: Load the homepage and inspect the Network tab filtered by third-party domains. Confirm that non-critical scripts do not request until after First Contentful Paint or until user interaction.

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** FCP occurs, **Then** no live chat, social widget, or non-essential tracker script has started downloading yet.
2. **Given** a visitor scrolls or clicks on the page, **When** interaction occurs, **Then** deferred third-party scripts may begin loading, but the main thread remains responsive (no TBT regression).
3. **Given** a third-party script is deferred, **When** it eventually loads, **Then** its functionality (chat widget, analytics events) still works correctly without console errors.

## Requirements *(mandatory)*

### Functional Requirements

#### 1. JavaScript Code Splitting & Lazy Loading

- **FR-001**: The initial JavaScript payload on the homepage MUST load no more than 25 script files (target: ≤20). Total `_nuxt/` JS payload MUST be under 1 MB.
- **FR-002**: Components below the fold (tour cards past the first 4, blog section, partner logos, footer widgets) MUST use dynamic `defineAsyncComponent` or Nuxt lazy-component patterns so their JS is not in the initial chunk.
- **FR-003**: Page-specific logic (tour gallery lightbox, booking form validation, datepicker) MUST be isolated from the shared vendor chunk and loaded only on routes that need it.
- **FR-004**: Any third-party Vue plugin used on only one page (e.g., map libraries, rich text editors) MUST be registered with `await import()` inside the consuming component, not globally in `nuxt.config.ts` or `plugins/`.
- **FR-005**: The shared vendor chunk (`node_modules` dependencies used on every page) MUST be analyzed with `npx nuxt analyze` to identify large dependencies that can be replaced with lighter alternatives or tree-shaken.

#### 2. Image Optimization & Responsive Delivery

- **FR-006**: All local static images larger than 50 KB MUST be converted to WebP at quality 80. API-sourced images MUST use `<NuxtImg>` with `format="webp"` or backend-supported format negotiation.
- **FR-007**: Hero banner images, tour card images, and highlight section images MUST include `srcset` with at least three width variants (mobile, tablet, desktop).
- **FR-008**: All images MUST have explicit `width` and `height` attributes (or aspect-ratio CSS) to prevent layout shift. CLS MUST remain at or below 0.
- **FR-009**: The `<picture>` element with PNG/JPEG fallback MUST be used only for critical above-the-fold images where WebP support is uncertain. All other images MAY be WebP-only.
- **FR-010**: `loading="lazy"` MUST be applied to all below-the-fold images. Above-the-fold images MUST use `loading="eager"` and `fetchpriority="high"`.

#### 3. Font Preloading & Display Strategy

- **FR-011**: All critical Trip Sans font files (Regular 400, Medium 500, Bold 700) MUST be preloaded in `<head>` via `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- **FR-012**: The `@font-face` declaration for Trip Sans MUST include `font-display: swap` so text renders immediately in a fallback font.
- **FR-013**: Non-critical font weights (e.g., Light 300, ExtraBold 800 if they exist) MUST NOT be preloaded; they may load normally or be deferred.
- **FR-014**: Any third-party font loader (e.g., Google Fonts WebFont.js) MUST use `display=swap` or equivalent. Google Fonts links MUST include `&display=swap`.

#### 4. Third-Party Script Inventory & Deferral

- **FR-015**: A complete inventory of all third-party scripts MUST be documented, including: name, purpose, URL pattern, which pages load it, and whether it is critical or deferrable.
- **FR-016**: All deferrable third-party scripts (live chat, heatmaps, remarketing pixels, non-essential trackers, social embeds) MUST load via the existing `third-party-scripts.client.ts` plugin or an equivalent `requestIdleCallback` + interaction-triggered pattern.
- **FR-017**: Critical third-party scripts (e.g., payment gateway, essential analytics) MAY load eagerly but MUST use `async` or `defer` attributes and MUST NOT block the HTML parser.
- **FR-018**: Any third-party script that is not used on a given page MUST NOT appear in that page's network requests (e.g., tour-specific chat widget should not load on the blog page).

### Key Entities

- **Local Image**: A static image file in the project's `public/` or `assets/` directory.
- **API Image**: An image served from the backend CDN via an external URL.
- **Critical Font**: A font weight required for above-the-fold brand text and headings.
- **Deferrable Script**: A third-party script whose functionality is not needed for the initial page render or first user interaction.
- **Above-the-Fold (ATF)**: The portion of the page visible without scrolling on a typical mobile viewport (375×667).
- **Below-the-Fold (BTF)**: Content that requires scrolling to become visible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lighthouse mobile Performance score improves from **42** to **≥70**.
- **SC-002**: Largest Contentful Paint (LCP) improves from **9.3 s** to **≤2.5 s** on mobile.
- **SC-003**: First Contentful Paint (FCP) improves from **3.3 s** to **≤1.8 s** on mobile.
- **SC-004**: Total Blocking Time (TBT) improves from **890 ms** to **≤200 ms** on mobile.
- **SC-005**: Time to Interactive (TTI) improves from **12.1 s** to **≤5.0 s** on mobile.
- **SC-006**: Total network requests on homepage load drop from **139** to **≤70**.
- **SC-007**: JavaScript script count drops from **62** to **≤25**.
- **SC-008**: Total page weight drops from **~2.9 MB** to **≤1.5 MB**.
- **SC-009**: CLS remains at **0** (no regression).
- **SC-010**: All local static images >50 KB are served as WebP with `srcset` variants.
- **SC-011**: Trip Sans fonts are preloaded and use `font-display: swap`.
- **SC-012**: No deferrable third-party script starts downloading before FCP.
- **SC-013**: `npm run build` completes with zero errors and zero new warnings.
- **SC-014**: ESLint passes with zero errors.

## Assumptions

- The project can use `<NuxtImg>` (from `@nuxt/image`) or an equivalent responsive image component for API-sourced images.
- The backend CDN does not yet support on-the-fly WebP conversion; therefore `NuxtImg` format conversion or build-time conversion is the primary path for local images.
- Trip Sans font files are already in `woff2` format or can be converted to `woff2` for optimal compression.
- The `third-party-scripts.client.ts` plugin architecture from Phase 009 can be extended to cover additional deferrable scripts without architectural changes.
- Browser support for `font-display: swap`, `loading="lazy"`, and WebP is assumed for the target audience (modern browsers, no IE11 requirement).
- Dynamic imports (`import()`) and `defineAsyncComponent` work correctly in the project's Nuxt 3 + Vite setup.
- No server-side logic depends on eagerly loaded below-the-fold component code.
