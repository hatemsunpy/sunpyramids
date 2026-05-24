# Research: JavaScript Bundle Reduction

**Feature**: 008-js-bundle-reduction
**Date**: 2026-05-24

## R1: Lazy i18n Loading with @nuxtjs/i18n v9.1.1

### Decision
Enable `lazy: true` in the `@nuxtjs/i18n` module configuration and correct the `langDir` path from `"locales/"` to `"i18n/locales/"`.

### Rationale
- @nuxtjs/i18n v9+ supports lazy loading out of the box. Setting `lazy: true` causes only the active/default locale file to be bundled in the initial JS payload. Non-active locales are loaded on demand via `$fetch` when the user switches languages.
- The current `langDir: "locales/"` is a non-existent path relative to project root. With `lazy: false` (current mode), this doesn't cause errors because all locale messages are loaded eagerly from files found via the `file` property in the locale config. However, with `lazy: true`, the module constructs fetch URLs from `langDir + locale.file`, meaning it would attempt to fetch from `/locales/en.json` which does not exist — the files are at `/i18n/locales/en.json`.
- The `detectBrowserLanguage` option is already `false`, which means no auto-detection/redirect on first visit, simplifying the lazy loading behavior.
- SSR behavior: With `lazy: true`, the active locale still renders server-side. Only inactive locale messages are deferred to client-side. This preserves SEO (translated content renders in raw HTML for the active language).
- Locale file sizes: en (21.3KB), fr (22.8KB), de (23.4KB), it (21.5KB), pt (21.7KB), es (22.8KB), zh (19.3KB) — total ~153KB. Lazy loading eliminates ~130KB+ of non-active locale data from the initial bundle.

### Alternatives Considered
- **Keep `lazy: false` and split locale files manually**: More complex, deviates from module conventions, no benefit over built-in lazy mode.
- **Use dynamic imports in custom i18n setup**: Reinvents what @nuxtjs/i18n already provides; risks breaking SSR i18n integration.
- **Code-split locale files without lazy mode**: Not supported by the module; all-or-nothing lazy setting.

### Implementation Details
1. In `nuxt.config.ts`, change `lazy: false` → `lazy: true`
2. Change `langDir: "locales/"` → `langDir: "i18n/locales/"`
3. Language switch UI: debounce repeated clicks while a locale fetch is pending. Use `useLocale()` composable's promise-based API or wrap `setLocale()` to track loading state.
4. Error handling: If a locale fetch fails, keep current language and optionally show a non-disruptive toast. The page must not crash or show raw translation keys.
5. `vueI18nLoader: true` is preserved — it enables the vue-i18n loader for custom block translations (if any exist).

---

## R2: vue3-toastify Client-Only Plugin

### Decision
Rename `plugins/vue3-toastify.js` to `plugins/vue3-toastify.client.js` and update the nuxt.config.ts plugin reference accordingly.

### Rationale
- Nuxt 3 automatically detects `.client.js` suffix plugins and excludes them from server-side rendering. No explicit `mode: 'client'` config is needed.
- The vue3-toastify library manipulates the DOM (toast notifications) and has no server-side purpose. Including it in the SSR bundle adds unnecessary JS processing during server render and bloats the client bundle with SSR reconciliation code.
- The plugin currently uses `defineNuxtPlugin` which runs on both server and client. Renaming to `.client.js` ensures it only runs in the browser.
- The `$toast` provide/inject pattern still works; components using `useNuxtApp().$toast` will continue to function because the plugin runs before hydration on the client.

### Alternatives Considered
- **SSR-safe conditional inside plugin**: `if (process.server) return` — still bundles the code in SSR output; doesn't reduce SSR processing.
- **Dynamic import in each component**: Requires changes to every component that uses toast; error-prone and verbose.

### Implementation Details
1. Rename file: `plugins/vue3-toastify.js` → `plugins/vue3-toastify.client.js`
2. In `nuxt.config.ts`, update plugin reference: `~/plugins/vue3-toastify.js` → `~/plugins/vue3-toastify.client.js`
3. Verify toast notifications work: form validation errors, success messages, and any `$toast` calls.
4. Verify the plugin code is absent from the server build output (`_nuxt/` chunks in `.output/server/`).

---

## R3: Swiper CSS Deduplication

### Decision
Move all Swiper CSS imports (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`, `swiper/css/free-mode`, `swiper/css/thumbs`) from individual Vue components into a single global entry in `nuxt.config.ts`, then remove the per-component imports.

### Rationale
- Codebase audit found **27 components** with **60+ individual `import 'swiper/css/...'` statements** (see full list below). Each import adds the same CSS rules to that component's chunk, causing significant CSS duplication.
- Unlike JS modules where tree-shaking handles duplicates, CSS imports in Vue SFCs with `<style>` blocks are processed per-component and embedded in each chunk. Vite does not deduplicate across async chunks by default.
- Swiper CSS is needed by most pages (homepage carousels, tour detail galleries, blog sliders, event galleries, etc.), so a global import does not create an unused CSS problem for most page loads.
- The `nuxt-swiper` Nuxt module provides Swiper component auto-imports but does NOT handle CSS imports — components must import CSS manually.
- Moving to a single global import ensures each Swiper CSS file is loaded exactly once.

### Full List of Affected Components

| # | Component | Imports to Remove |
|---|-----------|-------------------|
| 1 | `components/AboutUs/MainBanner.vue` | `swiper/css` |
| 2 | `components/Blogs/Blog/MainBanner.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 3 | `components/BookEgyptTrip/SelectedTours.vue` | `swiper/css` |
| 4 | `components/Disabled/RelatedTours.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 5 | `components/EgyptTripLandingFrance/SelectedTours.vue` | `swiper/css` |
| 6 | `components/EgyptTripLandingGerman/SelectedTours.vue` | `swiper/css` |
| 7 | `components/Event/Gallary.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 8 | `components/Event/RelatedTours.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 9 | `components/Events/EventCard.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 10 | `components/Events/Gallary.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 11 | `components/Home/MainBanner/index.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 12 | `components/Home/Highlights.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 13 | `components/Home/Parteners.vue` | `swiper/css` |
| 14 | `components/Home/PopularDistnation.vue` | `swiper/css` |
| 15 | `components/Home/SpecialOffers.vue` | `swiper/css` |
| 16 | `components/Home/gallary.vue` | `swiper/css` |
| 17 | `components/MarktingPages/SelectedTours.vue` | `swiper/css` |
| 18 | `components/Shared/EgyptToursCard.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 19 | `components/Shared/SpecialEvents.vue` | `swiper/css` |
| 20 | `components/Shared/TourCard.vue` | `swiper/css`, `swiper/css/pagination` |
| 21 | `components/Sustainability/RelatedTours.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 22 | `components/Tours/LeftPanal/Gallary.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 23 | `components/Tours/LeftPanal/Itinerary/day.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 24 | `components/Tours/LeftPanal/MainSwiper/index.vue` | `swiper/css`, `swiper/css/free-mode`, `swiper/css/navigation`, `swiper/css/thumbs` |
| 25 | `components/Tours/LeftPanal/Related.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 26 | `components/Tours/LeftPanal/Reviews.vue` | `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` |
| 27 | `components/UI/SwiperModal.vue` | `swiper/css`, `swiper/css/free-mode`, `swiper/css/navigation`, `swiper/css/thumbs` |

### CSS Modules Required Globally
- `swiper/css` — core Swiper styles
- `swiper/css/pagination` — pagination bullet styles
- `swiper/css/navigation` — prev/next arrow styles
- `swiper/css/free-mode` — free mode scroll styles (used by SwiperModal, MainSwiper)
- `swiper/css/thumbs` — thumbnail gallery styles (used by SwiperModal, MainSwiper)

### Alternatives Considered
- **Use Vite's `css.modules` for dedup**: Vite handles this per-chunk but doesn't deduplicate across async chunks. Not a solution for multi-component duplication.
- **Import only in layout files**: Doesn't cover all components; some Swiper usage is in deeply nested async components that may not be children of the importing layout.
- **Keep per-component imports**: No change — each component continues to bundle its own copy, increasing total CSS payload.

### Risk Assessment
- **CSS specificity/cascade order**: Importing globally via `nuxt.config.ts` CSS array may change the cascade order compared to per-component `<style>` imports. Mitigation: verify all carousels render correctly on homepage, tour pages, blog pages, and event pages.
- **Unused CSS on non-carousel pages**: A few pages (e.g., auth pages, profile settings) don't use Swiper but will get the CSS. Mitigation: Swiper CSS is small (~15KB gzipped) and the net reduction from deduping 60+ imports outweighs this.

---

## R4: Vercel Speed Insights Deduplication

### Decision
Remove the duplicate `@vercel/speed-insights` module entry (line 88 of nuxt.config.ts), keeping only `@vercel/speed-insights/nuxt` (line 89). Also delete the disabled no-op stub `plugins/vercel-analytics.client.ts`.

### Rationale
- Current modules array has BOTH `"@vercel/speed-insights"` AND `"@vercel/speed-insights/nuxt"`. The first is the base package (not a Nuxt module), the second is the actual Nuxt module integration. Having both may cause double initialization or at minimum wastes module resolution time.
- `@vercel/speed-insights/nuxt` is the correct Nuxt module entry point per the official documentation. The base package `@vercel/speed-insights` is its dependency and should not be listed as a separate module.
- The disabled `plugins/vercel-analytics.client.ts` is an empty no-op stub with a comment explaining it was disabled because it caused 404 errors. It serves no purpose and should be removed.
- Speed Insights injects its script via the module; a separate plugin is unnecessary.

### Implementation Details
1. In `nuxt.config.ts`, remove `"@vercel/speed-insights"` from the modules array (keep `"@vercel/speed-insights/nuxt"`)
2. Delete `plugins/vercel-analytics.client.ts`

---

## R5: Datepicker CSS Scoping

### Decision
Move the `@vuepic/vue-datepicker/dist/main.css` import from `app.vue` (global) to the two components that actually use the datepicker: `components/UI/Date.vue` and `components/UI/Shortcuts/Date.vue`. Keep the custom `.dp__*` and `.v3dp__*` CSS overrides in `app.vue`'s `<style>` block since those are global datepicker style customizations.

### Rationale
- The `@vuepic/vue-datepicker/dist/main.css` import in `app.vue` is loaded on every page, but the datepicker is only used in booking/checkout flows and the make-your-trip/rent-car forms.
- Two components import `VueDatePicker` from `@vuepic/vue-datepicker`: `components/UI/Date.vue` and `components/UI/Shortcuts/Date.vue`. Adding the CSS import to these components ensures it's bundled only when these components are loaded.
- The custom CSS overrides for `.v3dp__*` (old vue3-datepicker) and `.dp__*` (new @vuepic/vue-datepicker) classes in `app.vue`'s `<style>` block are custom styles, not the library CSS, and should remain global so they apply whenever the datepicker is rendered.
- The `vue3-datepicker@^0.4.0` package is also installed but NOT the same as `@vuepic/vue-datepicker@^11.0.0`. The `.v3dp__*` styles target the older package. Investigation needed to determine if the old package is still in use.

### Alternatives Considered
- **Keep global import**: No change — datepicker CSS loaded on every page unnecessarily (~8-10KB).
- **Use Nuxt CSS array for datepicker**: Same effect as global import; doesn't scope CSS to components that need it.
- **Dynamic import CSS**: `import('@vuepic/vue-datepicker/dist/main.css')` — works but adds async loading complexity; component-level static import is simpler.

### Risk Assessment
- **Unstyled datepicker (FOUC)**: If the CSS import is async and the datepicker component renders before it loads, there may be a brief flash of unstyled datepicker. Mitigation: use a static `import` (not dynamic) in the component's `<script>` so Vite bundles it synchronously with the component chunk.
- **Layout shift**: The datepicker CSS defines dimensions and positioning. Mitigation: static import in the component ensures CSS is loaded before the component mounts, preventing layout shift.

---

## R6: Orphaned Disabled Plugins

### Decision
Delete the two disabled no-op plugins: `plugins/vercel-analytics.client.ts` and `plugins/clear-payload.client.ts`.

### Rationale
- Both files are empty stubs that do nothing. They serve no purpose and add noise to the plugins directory.
- `vercel-analytics.client.ts` was already superseded by the @vercel/speed-insights Nuxt module.
- `clear-payload.client.ts` was disabled because it caused hydration crashes. If the clearing logic is needed in the future, it should be re-implemented with proper safeguards.
- Neither plugin is registered in `nuxt.config.ts`, so deleting them has zero impact on the build or app behavior.
- Nuxt 3 does NOT auto-register plugins — only those listed in `nuxt.config.ts` plugins array are loaded. The three active plugins are `vue3-toastify.js`, `vue-awesome-paginate.client.js`, and `vueGoogleMaps.client.ts`.

### Implementation Details
1. Delete `plugins/vercel-analytics.client.ts`
2. Delete `plugins/clear-payload.client.ts`
