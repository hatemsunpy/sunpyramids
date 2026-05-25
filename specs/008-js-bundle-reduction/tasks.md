# Tasks: JavaScript Bundle Reduction

**Input**: Design documents from `/specs/008-js-bundle-reduction/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested. No automated test tasks. All verification is manual (build + visual inspection).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Baseline Measurement)

**Purpose**: Establish current bundle size baseline before any changes

- [X] T001 Run `npm run build` and record the total `_nuxt/` JS payload size from `.output/public/_nuxt/` for before/after comparison
- [X] T002 [P] Run `npm run lint` and verify zero ESLint errors on the clean baseline

**Checkpoint**: Baseline metrics recorded. Ready to begin optimizations.

---

## Phase 2: User Story 1 - Faster Initial Page Load with Lazy i18n (Priority: P1) 🎯 MVP

**Goal**: Enable lazy i18n loading so only the active locale is bundled in the initial JS payload, eliminating ~130KB of non-active locale data.

**Independent Test**: Load any page and verify only one locale file appears in the Network tab (not all 7 bundled into the initial JS payload).

### Implementation for User Story 1

- [X] T003 [US1] In `nuxt.config.ts`, change i18n module config `lazy: false` to `lazy: true` and `langDir: "locales/"` to `langDir: "i18n/locales/"` (corrects the directory path so lazy fetches resolve locale files)
- [X] T004 [US1] In the active language switcher component (check both `components/Shared/LangAndCurrancies.vue` and `components/Models/languages&currancies.vue`), add debounce logic to prevent repeated language switch clicks while a locale fetch is pending. Track an `isLocaleLoading` ref; disable or debounce `setLocale()` calls when true. Ensure the UI keeps displaying the current language until the new locale is fully loaded, then swaps atomically.
- [X] T005 [US1] In the language switcher component, wrap `setLocale()` in a try/catch. On fetch failure, keep the current language active (do NOT call `setLocale` with the failed code), log the error, and optionally show a non-disruptive toast via `useNuxtApp().$toast`.
- [X] T006 [US1] Verify SSR behavior: run `npm run build`, then verify the homepage raw HTML (view-source) contains translated content for the default locale (en). All 7 language prefixes (`/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`) must render locale-specific translated content in their raw HTML.
- [X] T007 [US1] Verify lazy loading: in the browser Network tab, confirm only one locale JSON file (e.g., `en.json`) is fetched during initial page load. Switch language and confirm the new locale file is fetched on demand.

**Checkpoint**: Lazy i18n functional — single locale loaded on initial page, language switching works with debounce, SSR translated content preserved.

---

## Phase 3: User Story 2 - No SSR Overhead from Client-Only Plugins (Priority: P2)

**Goal**: Exclude vue3-toastify from server-side rendering by renaming its plugin to use the `.client.js` suffix.

**Independent Test**: Verify toast notifications still function correctly after the rename, and the plugin code is absent from server build output.

### Implementation for User Story 2

- [X] T008 [US2] Rename `plugins/vue3-toastify.js` to `plugins/vue3-toastify.client.js`
- [X] T009 [US2] In `nuxt.config.ts`, update the plugins array reference from `~/plugins/vue3-toastify.js` to `~/plugins/vue3-toastify.client.js`
- [X] T010 [US2] Verify toast notifications work: trigger a success toast (e.g., form submission), error toast, and any `$toast` calls across the app. Confirm autoClose (2s) and appearance are identical to before.
- [X] T011 [US2] Verify SSR exclusion: run `npm run build` and confirm vue3-toastify code is absent from `.output/server/` chunks (search for `vue3-toastify` in server output).

**Checkpoint**: Toast notifications work identically, plugin excluded from SSR bundle.

---

## Phase 4: User Story 3 - Deduplicated Swiper CSS (Priority: P3)

**Goal**: Replace 64 per-component Swiper CSS imports across 27 components with a single set of global CSS entries in `nuxt.config.ts`.

**Independent Test**: Verify Swiper CSS is loaded exactly once in the page (Network tab) and that all carousels/sliders render correctly.

### Implementation for User Story 3

- [X] T012 [US3] In `nuxt.config.ts`, add to the `css` array after `~/assets/styles/main.scss`: `swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`, `swiper/css/free-mode`, `swiper/css/thumbs`
- [X] T013 [P] [US3] Remove all `import "swiper/css"` statements from these 10 components (single-import files):
  - `components/AboutUs/MainBanner.vue` (line ~48)
  - `components/BookEgyptTrip/SelectedTours.vue` (line ~83)
  - `components/EgyptTripLandingFrance/SelectedTours.vue` (line ~83)
  - `components/EgyptTripLandingGerman/SelectedTours.vue` (line ~83)
  - `components/Home/Parteners.vue` (line ~34)
  - `components/Home/PopularDistnation.vue` (line ~89)
  - `components/Home/SpecialOffers.vue` (line ~83)
  - `components/Home/gallary.vue` (line ~82)
  - `components/MarktingPages/SelectedTours.vue` (line ~94)
  - `components/Shared/SpecialEvents.vue` (line ~83)
- [X] T014 [P] [US3] Remove all Swiper CSS imports (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`) from these 14 multi-import components:
  - `components/Blogs/Blog/MainBanner.vue` (lines ~37-39)
  - `components/Disabled/RelatedTours.vue` (lines ~53-55)
  - `components/Event/Gallary.vue` (lines ~45-47)
  - `components/Event/RelatedTours.vue` (lines ~53-55)
  - `components/Events/EventCard.vue` (lines ~37-39)
  - `components/Events/Gallary.vue` (lines ~47-49)
  - `components/Home/Highlights.vue` (lines ~75-77)
  - `components/Home/MainBanner/index.vue` (lines ~74-76)
  - `components/Shared/EgyptToursCard.vue` (lines ~44-46)
  - `components/Sustainability/RelatedTours.vue` (lines ~53-55)
  - `components/Tours/LeftPanal/Gallary.vue` (lines ~94-96)
  - `components/Tours/LeftPanal/Itinerary/day.vue` (lines ~105-107)
  - `components/Tours/LeftPanal/Related.vue` (lines ~53-55)
  - `components/Tours/LeftPanal/Reviews.vue` (lines ~69-71)
- [X] T015 [P] [US3] Remove all Swiper CSS imports (`swiper/css`, `swiper/css/free-mode`, `swiper/css/navigation`, `swiper/css/thumbs`) from these 2 multi-import components with free-mode/thumbs:
  - `components/Tours/LeftPanal/MainSwiper/index.vue` (lines ~65-68)
  - `components/UI/SwiperModal.vue` (lines ~56-59)
- [X] T016 [US3] Remove `import "swiper/css"` and `import "swiper/css/pagination"` from `components/Shared/TourCard.vue` (line ~146-147)
- [X] T017 [US3] Verify all Swiper carousels render correctly on these pages after CSS migration:
  - Homepage: main banner carousel, highlights section, partners carousel, special offers, popular destinations, gallery
  - Tour detail page (`/egypt-tours/[slug]`): main gallery swiper, itinerary day swiper, related tours, reviews
  - Blogs page (`/blogs/all-blogs`): blog cards
  - Blog detail page (`/blog/[slug]`): main banner
  - Events page (`/events`): event cards, gallery
  - Event detail page (`/event/[slug]`): gallery, related tours
  - About Us page: main banner
  - Sustainability page: related tours
  - SwiperModal (used for gallery lightbox on tour pages): verify thumbnail sync, navigation, free-mode

**Checkpoint**: All 27 components cleaned of Swiper CSS imports. All carousels render and function identically to pre-change behavior.

---

## Phase 5: User Story 4 - Clean Module Registration and Scoped CSS (Priority: P3)

**Goal**: Remove duplicate Vercel Speed Insights registration, scope datepicker CSS to its consuming components, and clean up disabled plugins.

**Independent Test**: Verify only one Speed Insights registration exists in config; verify datepicker CSS is absent from pages without datepicker; verify datepicker renders correctly on pages with it.

### Implementation for User Story 4

- [X] T018 [P] [US4] In `nuxt.config.ts` modules array, remove the duplicate `"@vercel/speed-insights"` entry. Keep only `"@vercel/speed-insights/nuxt"`.
- [X] T019 [P] [US4] Delete the disabled no-op plugin file `plugins/vercel-analytics.client.ts`
- [X] T020 [P] [US4] Delete the disabled no-op plugin file `plugins/clear-payload.client.ts`
- [X] T021 [US4] In `app.vue` line 19, remove `import '@vuepic/vue-datepicker/dist/main.css'`. Keep the custom `.v3dp__*` and `.dp__*` CSS overrides in the `<style lang="scss">` block (lines 70-126) — those are global style customizations needed wherever the datepicker renders.
- [X] T022 [US4] In `components/UI/Date.vue`, add `import '@vuepic/vue-datepicker/dist/main.css'` after the existing `VueDatePicker` import (around line 32)
- [X] T023 [US4] In `components/UI/Shortcuts/Date.vue`, add `import '@vuepic/vue-datepicker/dist/main.css'` after the existing `VueDatePicker` import (around line 30)
- [X] T024 [US4] Verify datepicker rendering: on a page with a datepicker (e.g., `/cart/checkout`, `/make-your-trip`, `/rent-car`), open the datepicker and confirm correct styling, no layout shift, no flash of unstyled content (FOUC). Verify calendar navigation, date selection, and input display work.
- [X] T025 [US4] Verify datepicker CSS scoping: on a page WITHOUT a datepicker (e.g., homepage `/`), use browser dev tools to confirm `@vuepic/vue-datepicker/dist/main.css` is NOT in the page's stylesheets.
- [X] T026 [US4] Verify Vercel Speed Insights: confirm the module appears exactly once in the config. In browser Network tab on any page, confirm the `/_vercel/insights/` script loads correctly (no 404).

**Checkpoint**: One Speed Insights registration, datepicker CSS only on pages that use it, no disabled orphaned plugins.

---

## Phase 6: Polish & Final Verification

**Purpose**: End-to-end validation, build verification, and performance measurement

- [X] T027 Run `npm run build` and verify zero build errors and zero warnings
- [X] T028 Run `npm run lint` and verify zero ESLint errors
- [X] T029 Measure and compare final bundle size: record total `_nuxt/` JS payload from `.output/public/_nuxt/` and compare against baseline from T001. Confirm >=20% reduction.
- [X] T030 Full site smoke test: click through homepage, tour listing, tour detail, blogs, events, about-us, contact-us, checkout, auth pages. Verify all pages load without errors, navigation works, and no visual regressions.
- [X] T031 [P] SEO verification: view-source on homepage `/` and `/fr` to confirm translated `<title>`, `<meta name="description">`, OG tags, and hreflang render in raw HTML (lazy i18n must not break SSR SEO).
- [X] T032 [P] Verify all 7 language switches work: `/` → switch to FR → switch to DE → switch to IT → switch to PT → switch to ES → switch to ZH → switch back to EN. Each switch must show translated content (no raw keys, no crashes).

**Checkpoint**: Feature complete. All success criteria from spec.md verified.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **US1 - Lazy i18n (Phase 2)**: No dependencies on other user stories. Can start after Phase 1.
- **US2 - Toast client-only (Phase 3)**: No dependencies on other user stories. Can start after Phase 1.
- **US3 - Swiper CSS dedup (Phase 4)**: No dependencies on other user stories. Can start after Phase 1.
- **US4 - Module cleanup + datepicker CSS (Phase 5)**: No dependencies on other user stories. Can start after Phase 1.
- **Polish (Phase 6)**: Depends on ALL user stories being complete

### User Story Dependencies

All four user stories are **completely independent**:
- **US1 (P1)**: Touches `nuxt.config.ts` (i18n section), language switcher component. No overlap with other stories.
- **US2 (P2)**: Touches `nuxt.config.ts` (plugins array), `plugins/vue3-toastify.client.js`. No overlap with other stories.
- **US3 (P3)**: Touches `nuxt.config.ts` (css array), 27 Vue components. No overlap with other stories.
- **US4 (P3)**: Touches `nuxt.config.ts` (modules array), `app.vue`, 2 datepicker components, 2 plugin files to delete. No overlap with other stories.

**nuxt.config.ts note**: All four stories touch different sections of `nuxt.config.ts` (i18n, plugins, css, modules). To avoid merge conflicts, implement changes in sequence or carefully merge non-overlapping sections.

### Within Each User Story

- Config changes before component changes
- Remove/replace before verifying
- Core implementation before integration testing
- Story complete and verified before moving to next

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **US1 (Phase 2)**: T003 is the config prerequisite; T004 and T005 touch the same file (language switcher) so must be sequential
- **US2 (Phase 3)**: T008 → T009 must be sequential (rename then update reference)
- **US3 (Phase 4)**: T013, T014, T015, T016 are all on DIFFERENT files and can run in parallel after T012 (config change)
- **US4 (Phase 5)**: T018, T019, T020 are on different files and can run in parallel. T022 and T023 can run in parallel.
- **Across stories**: Once Phase 1 is done, US1, US2, US3, US4 can all start in PARALLEL (different files, no dependencies between stories)
- **Phase 6**: T031 and T032 can run in parallel

---

## Parallel Example: Swiper CSS Removal (US3)

```bash
# After T012 (add global CSS to nuxt.config.ts), launch in parallel:
Task: "T013 - Remove single swiper/css imports from 10 components"
Task: "T014 - Remove swiper/css/* imports from 14 multi-import components"
Task: "T015 - Remove swiper/css/* imports from 2 free-mode/thumbs components"
Task: "T016 - Remove swiper/css imports from Shared/TourCard.vue"
```

## Parallel Example: All Stories After Setup

```bash
# Once Phase 1 (baseline) is complete, launch all stories in parallel:
Task: "Phase 2 (US1): Lazy i18n — T003 through T007"
Task: "Phase 3 (US2): Toast client-only — T008 through T011"
Task: "Phase 4 (US3): Swiper CSS dedup — T012 through T017"
Task: "Phase 5 (US4): Module cleanup + datepicker — T018 through T026"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) 🎯

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: US1 - Lazy i18n (T003-T007)
3. **STOP and VALIDATE**: Verify single locale file in Network tab, SSR translated content, language switching
4. Run `npm run build` to confirm build succeeds
5. This alone delivers the majority of bundle reduction (~130KB saved)

### Incremental Delivery (Recommended by quickstart.md)

The quickstart recommends implementing low-risk changes first, then the high-impact changes:

1. **Batch 1 (Low risk)**: US4 (T018-T026) + US2 (T008-T011) — Vercel dedup, disabled plugins, datepicker CSS, toast client-only. Total: ~13 tasks, minimal blast radius.
2. **Batch 2 (High impact)**: US1 (T003-T007) — Lazy i18n. The largest savings (~130KB). Total: 5 tasks.
3. **Batch 3 (Wide blast radius)**: US3 (T012-T017) — Swiper CSS dedup across 27 components. Total: 6 tasks, most verification work.

### Parallel Team Strategy

With multiple developers:

1. All complete Phase 1 together (T001-T002)
2. Once Phase 1 is done, each developer takes a different user story:
   - Developer A: US1 - Lazy i18n (T003-T007)
   - Developer B: US2 - Toast client-only (T008-T011)
   - Developer C: US3 - Swiper CSS dedup (T012-T017)
   - Developer D: US4 - Module cleanup + datepicker (T018-T026)
3. Coordinate on nuxt.config.ts (4 different sections, minimal conflict)
4. All converge on Phase 6: Polish & Final Verification (T027-T032)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- All verification is manual (no automated test framework)
- Commit after each phase or logical task group
- Stop at any checkpoint to validate story independently
- The `nuxt.config.ts` is touched by all 4 stories but in different sections — implement sequentially or merge carefully
- Swiper CSS removal (US3) touches 27 files — the largest change set. Do a git commit before starting this phase so rollback is easy.
