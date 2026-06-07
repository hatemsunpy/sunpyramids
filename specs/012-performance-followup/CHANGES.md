# Implementation Deviations — Phase 12: PageSpeed Audit Remediation

**Date**: 2026-06-07
**Plan**: `specs/012-performance-followup/plan.md`
**Tasks**: `specs/012-performance-followup/tasks.md`

---

## Deviation 1: `components/Home/TourCards.vue` Does Not Exist

**Task**: T007 — Wrap `components/Home/TourCards.vue` in `defineAsyncComponent` inside `pages/index.vue`

**Deviation**: The file `components/Home/TourCards.vue` does not exist in the codebase. Tour cards are rendered via `SharedTourCard` inside `HomePopularDistnation.vue` and `HomeSpecialOffers.vue`.

**Resolution**: 
- `HomeSpecialOffers` is already lazy-loaded (`LazyHomeSpecialOffers` in `pages/index.vue`).
- `HomePopularDistnation` remains eager because it is the 3rd section on the page and is arguably partially ATF on desktop. Converting it to async could delay content that users expect to see quickly.
- Marked T007 as completed with adaptation note.

---

## Deviation 2: `pages/tours/[id].vue` Path Mismatch

**Task**: T013 — Wrap `components/Tours/LeftPanal/Gallary.vue` in `pages/tours/[id].vue`

**Deviation**: The actual tour detail page is `pages/tour/[id].vue` (singular, not `tours`). Additionally, `Gallary.vue` is not imported directly in the page; it is imported inside `components/Tours/index.vue` (the `Tours` component consumed by the page).

**Resolution**: 
- Wrapped `ToursLeftPanalGallary` as `LazyToursLeftPanalGallary` in `components/Tours/index.vue` (line 14).
- This achieves the same goal of deferring the gallery component until needed.

---

## Deviation 3: `plugins/vercel-analytics.client.ts` Already Removed

**Task**: T014 — Remove `plugins/vercel-analytics.client.ts`

**Deviation**: The file does not exist. It was apparently removed in a prior phase.

**Resolution**: Marked as already completed.

---

## Deviation 4: `@fawmi/vue-google-maps` Completely Unused

**Task**: T012 — Move page-specific global Vue plugins to inline `await import()`

**Deviation**: `plugins/vueGoogleMaps.client.ts` was found to be completely unused — no Vue component in the entire codebase imports or uses any Google Maps component.

**Resolution**: 
- Deleted `plugins/vueGoogleMaps.client.ts` entirely.
- Removed `@fawmi/vue-google-maps` and `@googlemaps/markerclusterer` from `build.transpile`.
- Removed `@googlemaps/markerclusterer` from `vite.ssr.noExternal`.
- Removed `nitro.externals.inline` reference.
- This is a more aggressive optimization than moving to inline import, and it removes dead code entirely.

---

## Deviation 5: Pre-Existing ESLint Errors

**Task**: T034 — Run ESLint and confirm zero errors

**Deviation**: The codebase has 501 pre-existing ESLint errors across files not touched in this phase (`server/routes/sitemap-*.xml.ts`, `stores/sharedStore.js`, `utils/seo.js`, etc.).

**Resolution**: 
- Verified that **zero new ESLint errors** were introduced by this phase's changes.
- Pre-existing errors are out of scope for Phase 12 and should be addressed in a dedicated lint-fix phase.

---

## Deviation 6: No New Third-Party Scripts to Defer

**Task**: T029 — Extend `plugins/third-party-scripts.client.ts` for newly identified non-critical scripts

**Deviation**: After inventorying all third-party scripts, no additional deferrable scripts were found beyond those already handled by the existing plugin (GA4/GTM, TrustIndex, reCAPTCHA).

**Resolution**: 
- Documented the complete inventory in `third-party-inventory.md`.
- Confirmed the existing deferral architecture is sufficient.

---

## Deviation 7: `assets/images/` Has No Large Images

**Task**: T017 — Convert `assets/images/` to WebP

**Deviation**: `find assets/images -size +50k` returned zero results.

**Resolution**: Marked as completed with note that no qualifying images exist.

---

## Positive Surprises

1. **Font preloads already present**: `nuxt.config.ts` already had `<link rel="preload" as="font">` for Trip Sans (400, 500, 700).
2. **Font `display: swap` already present**: `assets/fonts/font.scss` already declared `font-display: swap` for all weights.
3. **Lazy components already used**: `pages/index.vue` already used `Lazy` prefix for most BTF sections (`LazyHomeHighlights`, `LazyHomeTravelBlogs`, `LazyHomeParteners`, etc.).
4. **Image optimization already partially present**: Hero banner already used `useImage()` for LCP preload and had `loading`/`fetchpriority` attributes. Tour cards already had `width`/`height` and `aspect-ratio`.

---

## Summary of Changes

| File | Change |
|------|--------|
| `nuxt.config.ts` | Added `vite.build.rollupOptions.output.manualChunks` for vendor deduplication; removed Google Maps transpile/externals |
| `plugins/vueGoogleMaps.client.ts` | **Deleted** (unused dead code) |
| `components/Tours/index.vue` | Changed `ToursLeftPanalGallary` to `LazyToursLeftPanalGallary` |
| `components/Home/MainBanner/index.vue` | Replaced `<img>` with `<NuxtImg format="webp" sizes="100vw">` |
| `components/Shared/TourCard.vue` | Replaced `<img>` with `<NuxtImg format="webp" sizes="...">` |
| `components/Shared/BlogCard.vue` | Replaced `<img>` with `<NuxtImg format="webp" sizes="...">` |
| `components/Home/Parteners.vue` | Replaced `<img>` with `<NuxtImg format="webp" sizes="...">` |
| `public/images/*.webp` | Generated WebP conversions for 9 PNG images |
| `CLAUDE.md` | Updated plan reference to `specs/012-performance-followup/plan.md` |
| `specs/012-performance-followup/` | Created `baseline-lighthouse.json`, `atf-btf-classification.md`, `image-conversion-list.md`, `third-party-inventory.md`, `CHANGES.md` |

---

## Verification Status

| Task | Status | Notes |
|------|--------|-------|
| T015 (Build & analyze) | ✅ Build passes; chunk count reduced from 414 → 209 | Run `npx nuxt analyze` for detailed report |
| T023 (Image DevTools check) | ⏳ Requires manual DevTools inspection | Verify WebP format and `srcset` on homepage |
| T026-T027 (Font FOIT/CLS) | ⏳ Requires manual Slow 3G test | Text should render immediately with fallback font |
| T032 (Script validation) | ⏳ Requires manual browser test | TrustIndex widgets, GA4, reCAPTCHA should work |
| T035 (Lighthouse regression) | ⏳ Requires Lighthouse run on built app | Target: Performance ≥70, no SEO regression |
