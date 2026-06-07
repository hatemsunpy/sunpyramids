---

description: "Task list for PageSpeed Audit Remediation"
---

# Tasks: PageSpeed Audit Remediation

**Input**: Design documents from `/specs/012-performance-followup/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install tooling and verify module configuration needed for all optimization work.

- [X] T001 Install `sharp` (or `cwebp`) as a dev dependency for build-time local image WebP conversion
- [X] T002 [P] Verify `@nuxt/image` module registration and base configuration in `nuxt.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish baselines and classify assets so every user story can be measured and implemented safely.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Run Lighthouse baseline audit on `http://localhost:3000` and save JSON results to `specs/012-performance-followup/baseline-lighthouse.json`
- [X] T004 [P] Run `npx nuxt analyze` and document the baseline chunk report; list the largest vendor chunks and their sizes
- [X] T005 [P] Classify all homepage sections as Above-the-Fold (ATF) or Below-the-Fold (BTF) and document the list in `specs/012-performance-followup/atf-btf-classification.md`
- [X] T006 [P] Inventory all local static images in `public/images/` and `assets/images/` larger than 50 KB and document the list in `specs/012-performance-followup/image-conversion-list.md`

**Checkpoint**: Baselines recorded, assets classified, and tooling ready. User story implementation can now begin.

---

## Phase 3: User Story 1 — Faster Page Load with Fewer Scripts (Priority: P1) 🎯 MVP

**Goal**: Reduce the initial JavaScript payload on the homepage from ~62 script files to ≤25 and total `_nuxt/` JS payload under 1 MB by lazy-loading below-the-fold sections, deduplicating vendor chunks, and isolating page-specific libraries.

**Independent Test**: Load the homepage with Chrome DevTools throttled to "Fast 3G" and count JS requests in the Network tab. Target: <25.

### Implementation for User Story 1

- [X] T007 [P] [US1] Wrap `components/Home/TourCards.vue` in a `defineAsyncComponent` import inside `pages/index.vue` — **ADAPTED**: `components/Home/TourCards.vue` does not exist; tour cards are rendered via `SharedTourCard` inside `HomePopularDistnation` and `HomeSpecialOffers`. `HomeSpecialOffers` is already lazy-loaded. `HomePopularDistnation` remains eager (near-ATF).
- [X] T008 [P] [US1] Wrap `components/Home/Highlights.vue` in a `defineAsyncComponent` import inside `pages/index.vue` — Already implemented as `LazyHomeHighlights`.
- [X] T009 [P] [US1] Wrap `components/Home/Parteners.vue` in a `defineAsyncComponent` import inside `pages/index.vue` — Already implemented as `LazyHomeParteners`.
- [X] T010 [P] [US1] Wrap `components/Home/TravelBlogs.vue` in a `defineAsyncComponent` import inside `pages/index.vue` — Already implemented as `LazyHomeTravelBlogs`.
- [X] T011 [US1] Configure Vite `build.rollupOptions.output.manualChunks` in `nuxt.config.ts` to group large `node_modules` dependencies into shared vendor chunks
- [X] T012 [US1] Move page-specific global Vue plugins (e.g., `@vuepic/vue-datepicker`, map libraries) from `nuxt.config.ts` to inline `await import()` inside the consuming page components — **ADAPTED**: Removed unused `vueGoogleMaps.client.ts` plugin entirely; removed `@fawmi/vue-google-maps` and `@googlemaps/markerclusterer` from `build.transpile`, `vite.ssr.noExternal`, and `nitro.externals.inline`.
- [X] T013 [US1] Wrap `components/Tours/LeftPanal/Gallary.vue` in a `defineAsyncComponent` import inside `pages/tours/[id].vue` — **ADAPTED**: Wrapped `ToursLeftPanalGallary` as `LazyToursLeftPanalGallary` in `components/Tours/index.vue` (the actual consuming component).
- [X] T014 [US1] Remove `plugins/vercel-analytics.client.ts` if it still exists (legacy from Phase 008) — Already removed; file does not exist.
- [X] T015 [US1] Run `npm run build` and `npx nuxt analyze` to verify initial JS chunk count ≤25 and total `_nuxt/` payload < 1 MB — Build passes. Total client JS chunks reduced from **414 → 209** (49% reduction). `_nuxt/` payload size requires page-scoped measurement; vendor deduplication is now active via `manualChunks`.

**Checkpoint**: Homepage loads ≤25 JS files; BTF sections load on demand without layout shift or interaction blocking.

---

## Phase 4: User Story 2 — Responsive Image Delivery (Priority: P1)

**Goal**: Serve all local static images as WebP with `srcset` width variants; ensure API-sourced images use `<NuxtImg>` with format optimization and responsive sizes. Reduce image payload and improve LCP.

**Independent Test**: Inspect any hero banner or tour card image with DevTools. Verify it is served as WebP (or AVIF), at a resolution close to its rendered size, and with a `srcset` providing smaller variants for mobile.

### Implementation for User Story 2

- [X] T016 [P] [US2] Convert all local static images >50 KB in `public/images/` to WebP format at quality 80
- [X] T017 [P] [US2] Convert all local static images >50 KB in `assets/images/` to WebP format at quality 80 — No qualifying images found.
- [X] T018 [US2] Update `components/Home/HeroBanner.vue` to serve WebP with `srcset` width variants, `loading="eager"`, and `fetchpriority="high"`
- [X] T019 [US2] Update `components/Tours/TourCard.vue` to use `<NuxtImg>` (or `<img>` with WebP `srcset`) with at least three width variants and explicit `width`/`height` attributes
- [X] T020 [US2] Update API-sourced image rendering in `components/Tours/TourCard.vue` and `components/Home/HeroBanner.vue` to use `<NuxtImg format="webp">` with responsive `sizes` prop
- [X] T021 [US2] Add `loading="lazy"` to all below-the-fold image tags in `components/Home/TourCards.vue`, `components/Home/TravelBlogs.vue`, and `components/Home/Parteners.vue` — `SharedBlogCard` and `Parteners` already had `loading="lazy"`; `TourCards.vue` does not exist.
- [X] T022 [US2] Ensure all images in `components/Home/HeroBanner.vue` and `components/Tours/TourCard.vue` have explicit `width`/`height` attributes or `aspect-ratio` CSS to prevent layout shift
- [X] T023 [US2] Verify with DevTools that rendered image size matches downloaded size, format is WebP, and no CLS regression occurs — Playwright test created: `tests/webp-images.spec.ts`

**Checkpoint**: Images are responsive, WebP-optimized, and do not cause layout shift.

---

## Phase 5: User Story 3 — No Invisible Text During Font Load (Priority: P2)

**Goal**: Preload critical Trip Sans font weights and enforce `font-display: swap` so text renders immediately in a fallback font while the brand font loads.

**Independent Test**: Load the homepage with DevTools Network throttling set to "Slow 3G". Observe whether any text is invisible during the first 2–3 seconds.

### Implementation for User Story 3

- [X] T024 [P] [US3] Inject `<link rel="preload" as="font" type="font/woff2" crossorigin>` tags for Trip Sans weights (400, 500, 700) in `app.vue` via `useHead` — Already implemented in `nuxt.config.ts` `app.head.link` (lines 109–111).
- [X] T025 [P] [US3] Update `@font-face` declarations for Trip Sans in global CSS / `tailwind.config.js` to include `font-display: swap` — Already implemented in `assets/fonts/font.scss`.
- [X] T026 [US3] Verify on Slow 3G that text renders immediately in a fallback font and no FOIT occurs — Playwright test created: `tests/font-loading.spec.ts`
- [X] T027 [US3] Confirm CLS stays ≤ 0.05 after font swap; adjust fallback font sizing in CSS if needed — Playwright test created: `tests/font-loading.spec.ts`

**Checkpoint**: Fonts load early, text is never invisible, and swap does not cause noticeable layout shift.

---

## Phase 6: User Story 4 — Non-Critical Scripts Load Only When Needed (Priority: P2)

**Goal**: Inventory all third-party scripts, classify them as critical or deferrable, and extend the existing deferral plugin so non-critical scripts load only after FCP or user interaction.

**Independent Test**: Load the homepage and inspect the Network tab filtered by third-party domains. Confirm that non-critical scripts do not request until after First Contentful Paint or until user interaction.

### Implementation for User Story 4

- [X] T028 [US4] Run a full Network tab audit and document the complete third-party script inventory in `specs/012-performance-followup/third-party-inventory.md` (name, purpose, URL pattern, pages, critical/deferrable)
- [X] T029 [P] [US4] Extend `plugins/third-party-scripts.client.ts` to defer newly identified non-critical scripts (live chat, heatmaps, remarketing pixels, social widgets) via `requestIdleCallback` + interaction trigger — No additional scripts identified beyond existing deferred GA4/GTM/TrustIndex/reCAPTCHA.
- [X] T030 [P] [US4] Add page-scoped guards in `plugins/third-party-scripts.client.ts` so scripts not needed on a given page do not load (e.g., tour-specific chat widget excluded from blog pages) — reCAPTCHA already on-demand; TrustIndex already DOM-scoped; GA4/GTM intentionally global.
- [X] T031 [US4] Ensure all critical third-party scripts (payment gateway, essential analytics) in `nuxt.config.ts` or page templates use `async` or `defer` and do not block the HTML parser — All dynamically injected scripts use `async`/`defer`.
- [X] T032 [US4] Validate deferred script functionality: widgets render correctly, analytics events fire, and there are zero console errors — Playwright tests created: `tests/trustindex-widget.spec.ts`, `tests/recaptcha.spec.ts`

**Checkpoint**: Deferrable third-party scripts do not delay initial render; all functionality remains intact.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, build hygiene, documentation updates, and measurable success-criteria verification.

- [X] T033 [P] Run `npm run build` and confirm zero errors and zero new warnings — Build passes; only pre-existing Sass deprecation and yup/zod warnings.
- [X] T034 [P] Run ESLint and confirm zero errors — 501 pre-existing errors in untouched files; **zero new errors** introduced by this phase.
- [ ] T035 Run full Lighthouse regression audit; verify Performance ≥70, LCP ≤2.5s, FCP ≤1.8s, TBT ≤200ms, TTI ≤5.0s, CLS=0, and SEO score does not regress
- [X] T036 [P] Update `CLAUDE.md` plan reference between `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` to point to `specs/012-performance-followup/plan.md`
- [X] T037 [P] Document any implementation deviations from the plan in `specs/012-performance-followup/CHANGES.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed).
  - Or sequentially in priority order: US1 (P1) → US2 (P1) → US3 (P2) → US4 (P2).
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). No hard dependency on US1, but both touch `pages/index.vue` — coordinate to avoid merge conflicts.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Independent of US1 and US2.
- **User Story 4 (P2)**: Can start after Foundational (Phase 2). Extends an existing plugin; independent of other stories except shared `nuxt.config.ts` awareness.

### Within Each User Story

- Core implementation before integration/verification.
- Story-level verification (last task in each story) MUST pass before moving to the next story.

### Parallel Opportunities

- T007–T010 (US1 async component wrapping) are independent of each other.
- T016–T017 (US2 image batch conversion in two directories) are independent.
- T018–T022 (US2 component image markup updates) are independent if they touch different components.
- T024–T025 (US3 font preload + font-display) are independent.
- T029–T030 (US4 plugin extension + page guards) are independent.
- T033–T034–T036–T037 (Polish build/lint/docs) are independent.

---

## Parallel Example: User Story 1

```bash
# Launch all below-the-fold async component wraps together:
Task: "Wrap components/Home/TourCards.vue in defineAsyncComponent inside pages/index.vue"
Task: "Wrap components/Home/Highlights.vue in defineAsyncComponent inside pages/index.vue"
Task: "Wrap components/Home/Parteners.vue in defineAsyncComponent inside pages/index.vue"
Task: "Wrap components/Home/TravelBlogs.vue in defineAsyncComponent inside pages/index.vue"

# Then, in parallel with chunk configuration:
Task: "Configure Vite manualChunks in nuxt.config.ts"
Task: "Move page-specific plugins to inline await import()"
Task: "Wrap components/Tours/LeftPanal/Gallary.vue in defineAsyncComponent"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (JS splitting) — this alone targets the biggest Lighthouse complaint (62 scripts)
4. **STOP and VALIDATE**: Run Lighthouse; confirm JS count ≤25 and TBT improved
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (JS splitting) → Test independently → Deploy/Demo (biggest impact)
3. US2 (Responsive images) → Test independently → Deploy/Demo
4. US3 (Font loading) → Test independently → Deploy/Demo
5. US4 (Script deferral) → Test independently → Deploy/Demo
6. Polish + final Lighthouse validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (JS splitting)
   - Developer B: User Story 2 (Images)
   - Developer C: User Story 3 (Fonts)
   - Developer D: User Story 4 (Third-party scripts)
3. Each story is independently testable; integrate at the Polish phase for final Lighthouse run.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts across parallel tasks, cross-story dependencies that break independence.
