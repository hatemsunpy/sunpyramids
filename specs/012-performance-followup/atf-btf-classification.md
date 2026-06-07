# ATF / BTF Classification — Homepage (`pages/index.vue`)

**Date**: 2026-06-07
**Method**: Visual assessment of component order + existing lazy-loading state.

---

## Above-the-Fold (ATF)

Components visible in the initial viewport on a 1080p desktop and typical mobile screen.

| # | Component | File | Notes |
|---|-----------|------|-------|
| 1 | `HomeMainBanner` | `components/Home/MainBanner.vue` | Hero banner; primary LCP element |
| 2 | `SharedSpecialEvents` | `components/Shared/SpecialEvents.vue` | Special events section; immediately below hero |
| 3 | `HomePopularDistnation` | `components/Home/PopularDistnation.vue` | Popular destinations grid |

---

## Below-the-Fold (BTF)

Components below the initial viewport. These are candidates for lazy-loading.

| # | Component | File | Already Lazy? |
|---|-----------|------|---------------|
| 1 | `HomeMakeYourTrip` | `components/Home/MakeYourTrip.vue` | ✅ `LazyHomeMakeYourTrip` |
| 2 | `HomeSpecialOffers` | `components/Home/SpecialOffers.vue` | ✅ `LazyHomeSpecialOffers` |
| 3 | `HomeBookingSteps` | `components/Home/BookingSteps.vue` | ✅ `LazyHomeBookingSteps` |
| 4 | `HomeHighlights` | `components/Home/Highlights.vue` | ✅ `LazyHomeHighlights` |
| 5 | `HomeTravelBlogs` | `components/Home/TravelBlogs.vue` | ✅ `LazyHomeTravelBlogs` |
| 6 | `HomeCertificationOverview` | `components/Home/CertificationOverview.vue` | ✅ `LazyHomeCertificationOverview` |
| 7 | `HomeGallary` | `components/Home/Gallary.vue` | ✅ `LazyHomeGallary` |
| 8 | `HomeFrequentlyAsked` | `components/Home/FrequentlyAsked.vue` | ✅ `LazyHomeFrequentlyAsked` |
| 9 | `HomeNeedHelp` | `components/Home/NeedHelp.vue` | ✅ `LazyHomeNeedHelp` |
| 10 | `HomeParteners` | `components/Home/Parteners.vue` | ✅ `LazyHomeParteners` |
| 11 | `HomeTourCards` | `components/Home/TourCards.vue` | ❌ Not directly used on homepage; used inside other pages/sections |

---

## Observations

- The homepage already applies Nuxt's automatic `defineAsyncComponent` wrapping via the `Lazy` prefix for the majority of BTF sections.
- `TourCards.vue` is not directly imported in `pages/index.vue`; it is likely consumed by `HomePopularDistnation` or other listing pages.
- The main optimization opportunity for JS splitting is therefore not adding more `Lazy` wrappers to the homepage (they're mostly already present), but rather:
  1. Configuring `manualChunks` to deduplicate vendor libraries (T011).
  2. Moving page-specific plugins to inline `await import()` (T012).
  3. Wrapping heavy gallery components on other pages, e.g., `pages/tours/[id].vue` (T013).
  4. Removing legacy analytics plugins (T014).

---

## Classification Source

Based on `pages/index.vue` component order and standard viewport estimates (desktop ~900 px, mobile ~700 px initial viewport height).
