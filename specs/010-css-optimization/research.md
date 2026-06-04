# Research: CSS Optimization for First Contentful Paint

**Feature**: 010-css-optimization
**Date**: 2026-05-25
**Purpose**: Resolve technical unknowns before Phase 1 design

---

## R1: Critical CSS Extraction for Nuxt 3 SSR

### Decision

Use **beasties** (the maintained fork of the `critters` package) as a custom Nuxt module that inlines critical CSS during SSR for static top-level pages.

### Rationale

- `critters` was the standard but is unmaintained since 2021. `beasties` is the active community fork with Nuxt 3 support, ESM compatibility, and bug fixes.
- `beasties` integrates cleanly as a Nuxt hook (`render:response`) that processes the HTML after SSR, extracting only the CSS used by above-the-fold elements and inlining it into `<head>`.
- Per spec, only static top-level pages (/, /tours, /about-us, /contact-us, /events, /make-your-trip + locale variants) will receive inline critical CSS. A route whitelist in the module config controls this.
- The 14KB cap is a `beasties` built-in option (`inlineThreshold`).
- `beasties` automatically handles the asynchronous loading of the remaining external stylesheet via `preload` + `onload` pattern, satisfying FR-003.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| `nuxt-critters` (old module) | Unmaintained, incompatible with Nuxt 3.15+ |
| `@nuxtjs/critters` | Thin wrapper, same unmaintained dependency |
| `vite-plugin-critical` | Build-time only, less Nuxt integration |
| `critical` (Google package) | Designed for static HTML; requires headless Puppeteer — heavy dependency, slow |
| Manual SSR injection | Error-prone, reinventing the wheel |

### Implementation Notes

- Install `beasties` (no additional plugins needed).
- Create a custom Nuxt module at `modules/critical-css.ts` (or inline in `nuxt.config.ts`).
- Whitelist routes: `/`, `/tours`, `/about-us`, `/contact-us`, `/events`, `/make-your-trip` and all locale-prefixed variants (`/fr`, `/de/tours`, etc.).
- Config: `inlineThreshold: 14336` (14KB in bytes), `preload: 'swap'`, `compress: false` (Vercel handles compression).
- FR-004 (skip on cached CSS): Add cookie-based guard. Set a `css-cached` cookie on first load; if present, skip `beasties` processing.

---

## R2: Route-Level CSS Code Splitting

### Decision

Move Swiper CSS imports from the global `css:` array in `nuxt.config.ts` to component-level `@import` or `<style>` blocks in the components that actually use Swiper.

### Rationale

- Nuxt 3 + Vite automatically code-splits CSS imported at the component level. The global `css:` array bypasses this mechanism and forces all listed files into a single shared bundle.
- By moving Swiper CSS into the pages/components that use it (Tours listing, Event detail, marketing pages with carousels), Vite will extract them into route-specific CSS chunks. Pages without Swiper (Contact Us, About Us, Checkout) won't download Swiper CSS.
- The existing `nuxt-swiper` module already provides component registration; CSS can be imported inside those components' `<style>` blocks or via a `<script setup>` import.
- No new dependencies required — this is a configuration and import hygiene change.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| Keep global `css:` but use PurgeCSS to remove unused | Doesn't prevent download — CSS is still in the bundle |
| Dynamic CSS injection at runtime | Adds JS overhead, harder to manage, flashes |
| Manual `<link>` tags per route | Fragile, duplicates Nuxt's build pipeline |

### Implementation Notes

- Remove all 5 Swiper CSS paths from `nuxt.config.ts` `css:` array.
- In each component using Swiper, add: `import 'swiper/css'` etc. inside `<script setup>` or use a `<style lang="scss"> @import 'swiper/css'; </style>` block.
- Verify that `main.scss` stays in the global `css:` array (it contains shared layout, fonts, Tailwind utilities needed everywhere).
- Vite's CSS code splitting will automatically generate route-level chunks without additional configuration.

---

## R3: Unused CSS Removal (SCSS + Tailwind)

### Decision

Use **PurgeCSS** via a custom PostCSS configuration for production builds only, with a conservative safelist to prevent false positives. Focus primarily on SCSS files (`main.scss`, `responsive.scss`, `booking-success.scss`, `pagination.scss`).

### Rationale

- Tailwind CSS v3+ JIT mode already eliminates unused Tailwind utilities. The Tailwind output is not the problem.
- The SCSS files contain hand-written selectors that may have become orphaned as the codebase evolved. PurgeCSS scans the HTML/JS output and removes selectors not present in the DOM.
- A conservative `safelist` prevents removal of:
  - Dynamically-applied classes (e.g., `nuxt-icon`, `errorStyle`, scrollbar classes)
  - Third-party library classes referenced in HTML but not in source (Swiper, vee-validate)
  - State-based classes (`is-active`, `is-open`, etc.)
- Running PurgeCSS in production builds only avoids slowing down development HMR.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| Manual audit and removal | Labor-intensive, won't catch all, drifts over time |
| `@fullhuman/postcss-purgecss` | Standard PostCSS plugin, same underlying tool. Acceptable alternative if preferred. |
| Tailwind `blocklist` | Only controls Tailwind output, not SCSS |
| Skip purging | Leaves measurable dead CSS in production (violates SC-005) |

### Implementation Notes

- Install `@fullhuman/postcss-purgecss` (dev dependency).
- Configure in `postcss.config.js` with `content` paths pointing to all Vue/TS/JS files, plus a safelist.
- Enable only in production (check `process.env.NODE_ENV`).
- SCSS files to scan: `assets/styles/main.scss`, `assets/styles/responsive.scss`, `assets/styles/booking-success.scss`, `assets/styles/pagination.scss`.
- CSS coverage audit after implementation to verify SC-005 (unused CSS under 10%).

---

## R4: Browser Cache Detection for CSS

### Decision

Set a `css-cached` cookie on first page load when critical CSS is inlined. On subsequent requests (cookie present), skip critical CSS inlining and use the standard `<link rel="stylesheet">` path.

### Rationale

- `beasties` already supports conditional processing. The cookie check can be implemented in the Nuxt render hook wrapper.
- Cookie-based approach is simple, standard, and doesn't require JavaScript. The cookie is set via an HTTP `Set-Cookie` header alongside the first response that includes inline critical CSS.
- On the first visit: no cookie → inline critical CSS → set cookie → full CSS loaded via async preload. On return visits: cookie present → standard `<link rel="stylesheet">` → browser uses cached CSS from disk.
- This satisfies FR-004 without adding JavaScript overhead or client-side detection logic.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| `localStorage` check | Requires JS execution, doesn't work on first SSR render |
| ETag / `If-None-Match` | Too fine-grained; CSS files may change between deploys |
| Service Worker | Overkill for this use case |
| Always inline | Unnecessary HTML bloat for returning visitors (spec explicitly requires this optimization) |

### Implementation Notes

- Set cookie in Nitro response via `event.node.res.setHeader('Set-Cookie', ...)`.
- Cookie: `css-cached=true; Path=/; Max-Age=2592000; SameSite=Lax` (30 days).
- Check `event.node.req.headers.cookie` before running `beasties` processing.
- Cookie is set regardless of whether critical CSS was inlined (to cover the "budget exceeded" fallback case where optimization is skipped on some pages).

---

## Summary of Technical Decisions

| # | Decision | Implementation |
|---|----------|----------------|
| R1 | Critical CSS via `beasties` | Custom Nuxt module with route whitelist |
| R2 | Route CSS splitting via import relocation | Move Swiper CSS to components |
| R3 | Unused CSS via PurgeCSS | PostCSS plugin, production only, conservative safelist |
| R4 | Cache detection via cookie | HTTP Set-Cookie + request header check |
