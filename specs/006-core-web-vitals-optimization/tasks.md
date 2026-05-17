# Tasks: Core Web Vitals Optimization

**Input**: Design documents from `/specs/006-core-web-vitals-optimization/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec. Test tasks are omitted. Validation relies on Lighthouse lab audits and manual verification per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Baseline Measurement

**Purpose**: Capture pre-optimization baselines and enable production monitoring

- [ ] T001 Create baseline Lighthouse report for homepage (`npx lighthouse http://localhost:3000/ --output=html --output-path=./reports/home-baseline.html --only-categories=performance`) *(requires running app)*
- [ ] T002 [P] Create baseline Lighthouse report for tour detail page (`npx lighthouse http://localhost:3000/tour/{slug} --output=html --output-path=./reports/tour-baseline.html --only-categories=performance`) *(requires running app)*
- [ ] T003 [P] Audit current `__NUXT__` hydration payload size in production build output (`npm run build && npm run preview`, inspect HTML for `window.__NUXT__` size) *(requires running app)*
- [x] T004 [P] Enable Vercel Analytics plugin via `plugins/vercel-analytics.client.ts` (FR-009)

---

## Phase 2: Foundational Configuration (Blocking Prerequisites)

**Purpose**: Global configuration changes that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Configure aggressive Cache-Control headers for static/media assets in `nuxt.config.ts` (`max-age=31536000, immutable` for hashed assets, `public, max-age=86400` for images)
- [x] T006 Set NuxtLink prefetch defaults in `nuxt.config.ts` (`experimental.defaults.nuxtLink.prefetch = false`, `prefetchOn: 'interaction'`, FR-006)
- [x] T007 [P] Replace oversized PNG social/footer icons with optimized SVGs in `components/Footer/index.vue` (replaced `/images/whatsapp-footer.png` with inline SVG, FR-003)
- [x] T008 [P] Audit and scan all card components (TourCard, BlogCard) and hero banner for current image loading attributes, explicit dimensions, and NuxtLink prefetch state — documented (DestinationCard does not exist as standalone component)
- [x] T009 Configure Nuxt Image module provider defaults in `nuxt.config.ts` (set `quality: 80`, `format: ['webp', 'avif']`, responsive screens)

**Checkpoint**: Foundation ready — all shared configuration in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - Fast Homepage Load (Priority: P1)

**Goal**: Users loading the homepage experience a visually complete page (LCP) quickly without content jumping around (CLS).

**Independent Test**: Run `npx lighthouse http://localhost:3000/ --output=html --output-path=./reports/home-optimized.html --only-categories=performance` and verify LCP ≤ 2.5s and CLS ≤ 0.1 on mobile emulation.

### Implementation for User Story 1

#### CLS: Layout Stability

- [x] T010 [US1] Add explicit `width` and `height` props to all `NuxtImg` instances in `components/shared/TourCard.vue` (enforce aspect ratio on image wrapper, `h-[12.125rem]` with `width="400" height="194"`, FR-002)
- [x] T011 [P] [US1] Add explicit `width` and `height` props to `NuxtImg` in `components/shared/BlogCard.vue` (`width="400" height="193"` on `h-[12.0625rem]` wrapper, FR-002)
- [x] T012 [P] [US1] N/A: `components/shared/DestinationCard.vue` does not exist as a standalone component. Tour cards with destination info use `SharedTourCard`.
- [x] T013 [P] [US1] Add explicit `width`/`height` to footer logo `NuxtImg` in `components/Footer/index.vue` (`width="260" height="56"` on `w-[16.25rem]` logo)

#### LCP: Hero Image Priority Loading

- [x] T014 [US1] Fix hero image visibility delay in `components/home/MainBanner/index.vue` — removed the `isSwiperReady` CSS class toggle that hid the static hero image with `absolute` positioning (FR-005)
- [x] T015 [US1] Add `fetchpriority="high"` and `loading="eager"` to the LCP hero image in `components/home/MainBanner/index.vue` (applied `fetchpriority="high"` to index 0 swiper image, preserved existing `fetchpriority="high"` on static fallback image, FR-005)
- [x] T016 [US1] Add `<link rel="preload" as="image">` for the LCP hero image URL via `useHead` composable in `components/home/MainBanner/index.vue` (preloads `homeData.gallery[0]` with `fetchpriority="high"`)

#### Image Payload Reduction

- [x] T017 [P] [US1] Ensure all below-fold images use `loading="lazy"` in shared card components (TourCard: dynamic `loading="eager"` for first image only, `loading="lazy"` for rest; BlogCard: `loading="lazy"`; Footer certified image: `loading="lazy"`, FR-004)

#### TBT: JavaScript Reduction

- [x] T018 [P] [US1] Replace `setInterval` offer countdown timer with `requestAnimationFrame` in `components/shared/TourCard.vue` (with 1s throttle + `onBeforeUnmount` cleanup)
- [x] T019 [P] [US1] Already implemented — `pages/index.vue` uses Nuxt `Lazy` prefix for all below-fold components (LazyHomeMakeYourTrip, LazyHomeSpecialOffers, LazyHomeBookingSteps, etc.)
- [x] T020 [US1] Enable Swiper lazy-loading in `components/shared/TourCard.vue` (added `Lazy` module to Swiper modules)

**Checkpoint**: At this point, homepage should show LCP ≤ 2.5s and CLS ≤ 0.1 on mobile Lighthouse. Image payload should be reduced.

---

## Phase 4: User Story 2 - Navigation without Prefetch Bloat (Priority: P2)

**Goal**: Users viewing the homepage do not automatically download dozens of internal route HTML documents.

**Independent Test**: Open DevTools Network tab → Filter: Doc → Reload homepage. Only the main document `/` should load; no flood of `/tour/*` or `/blog/*` document requests.

### Implementation for User Story 2

- [x] T021 [US2] Add `:prefetch="false"` to all NuxtLinks wrapping images and titles in `components/shared/TourCard.vue` (links remain real `<a href>` for crawlability, FR-006)
- [x] T022 [P] [US2] Add `:prefetch="false"` to all NuxtLinks wrapping images and titles in `components/shared/BlogCard.vue` (links remain real `<a href>` for crawlability, FR-006)
- [x] T023 [P] [US2] N/A: `components/shared/DestinationCard.vue` does not exist. Global prefetch=false config in nuxt.config.ts covers all NuxtLinks.
- [x] T024 [US2] Convert Footer privacy/terms links from `@click="router.push"` to `NuxtLink` with `:prefetch="false"` in `components/Footer/index.vue` (remain real `<a href>` elements per SEO contract)
- [ ] T025 [US2] Verify no prefetch flood on homepage load — open DevTools Network tab → Doc filter, reload homepage, confirm only the main document `/` loads (SC-008) *(manual verification)*

**Checkpoint**: Homepage no longer prefetches internal route documents. All links remain crawlable `<a href>` elements.

---

## Phase 5: User Story 3 - Booking Flow Preserved (Priority: P1)

**Goal**: Users must still be able to successfully book a tour without JavaScript deferral breaking forms.

**Independent Test**: Complete a full booking flow (select tour → book → fill form → submit) on staging/production.

### Implementation for User Story 3

- [ ] T026 [US3] Verify all form components (booking, contact) remain functional with deferred scripts — test form submission end-to-end on staging *(manual verification on staging)*
- [x] T027 [P] [US3] Ensure recaptcha script keeps `defer`/`async` attributes and TrustIndex script in `components/Footer/index.vue` retains `process.client` guard + `async`/`defer` (verified: no changes made to these scripts)
- [ ] T028 [US3] Verify tour detail page (`pages/tour/[slug].vue`) booking section renders and functions correctly after shared component changes *(manual verification on staging)*

**Checkpoint**: Booking flow is fully functional. All third-party scripts load correctly. No form breakage.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Fix remaining issues that span multiple user stories

### Hydration Mismatch Fix

- [x] T029 Fix hydration mismatch — wrap TrustIndex script injection containers in `<ClientOnly>` in both `pages/index.vue` (`#home-reviews`) and `components/Footer/index.vue` (`#footer-cert`) to prevent SSR/client DOM mismatch (FR-007)
- [x] T030 [P] Audit `app.vue`, `pages/index.vue`, and `pages/tour/[slug].vue` for SSR-unsafe code — no unguarded `localStorage`, `window`, or `document` access found outside `onMounted`/`process.client` guards
- [ ] T031 Verify no "Hydration completed but contains mismatches" warning in browser console on homepage and tour detail page (SC-007) *(manual verification)*

### CSS Render-Blocking Optimization

- [x] T032 Optimize render-blocking CSS — added `experimental.inlineSSRStyles: true` (inlines component CSS during SSR to eliminate render-blocking external stylesheets) and `vite.build.cssMinify: true` in `nuxt.config.ts`

### Payload Size Reduction

- [x] T033 Optimize `useFetch` calls — added `pickFields` parameter to `useApi` composable, updated MainBanner `getData('pages/home?includes=seo', {}, true, ['gallery', 'seo'])` to only fetch needed fields (data-model.md target: reduce `__NUXT__`)
- [x] T034 [P] Create `plugins/clear-payload.client.ts` to clear `window.__NUXT__` after hydration completes (frees browser memory, Pinia stores retain data independently)

### Final Validation

- [ ] T035 Run final Lighthouse audit on homepage *(requires `npm run build && npm run preview` and Lighthouse CLI)*
- [ ] T036 [P] Run final Lighthouse audit on tour detail page *(requires running app)*
- [ ] T037 [P] Verify all SEO tags remain server-rendered and intact via `curl` *(requires running app)*
- [ ] T038 [P] Verify `?no-third-party=1` diagnostic mode — code unchanged; TrustIndex/GTM conditional logic in `app.vue` and `pages/index.vue` preserved (FR-008)
- [ ] T039 Run full validation checklist from `quickstart.md` *(requires running app)*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) completion — independent of US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 completion (validates booking flow after all optimizations)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories. Core optimization work.
- **User Story 2 (P2)**: Can start after Phase 2 — independent of US1. Parallelizable with US1.
- **User Story 3 (P1)**: Must run AFTER US1 + US2 — validates nothing is broken by prior phases.

### Within Each User Story

- CLS layout fixes before LCP priority fixes (stable layout prevents LCP re-evaluation)
- Image optimization before TBT/JS optimization
- Each card component fixed independently where marked [P]

### Parallel Opportunities

- T001, T002, T003, T004 all run in parallel (Phase 1)
- T007, T008, T009 run in parallel after T005-T006 (Phase 2)
- T011, T012, T013 run in parallel (US1 CLS fixes on different components)
- T017, T018, T019 run in parallel (US1 image/TBT fixes on different files)
- T022, T023 run in parallel (US2 on different card components)
- T027 runs in parallel with T026 (US3)
- T030, T034, T036, T037, T038 run in parallel (Phase 6 validation)

---

## Parallel Example: User Story 1

```bash
# Launch all CLS fixes for different card components together:
Task: "Add explicit width/height to BlogCard images in components/shared/BlogCard.vue"
Task: "Add explicit dimensions to DestinationCard in components/shared/DestinationCard.vue"
Task: "Add explicit width/height to footer logo in components/Footer/index.vue"

# Launch TBT/image tasks together (different files):
Task: "Ensure below-fold images use loading=lazy in card components"
Task: "Replace setInterval countdown with requestAnimationFrame in TourCard.vue"
Task: "Dynamic import non-critical components in pages/index.vue"
```

## Parallel Example: User Story 2 + User Story 1

```bash
# US1 and US2 can proceed in parallel after Phase 2:
Developer A: Phase 3 (US1) - LCP/CLS/TBT fixes
Developer B: Phase 4 (US2) - Prefetch fixes on all card components
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 3)

1. Complete Phase 1: Setup & Baseline
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (LCP/CLS optimization)
4. Complete Phase 4: User Story 2 (Prefetch)
5. Complete Phase 5: User Story 3 (Booking flow validation)
6. **STOP and VALIDATE**: Verify all primary CWV targets pass on mobile Lighthouse
7. Deploy to staging for final validation

### Incremental Delivery

1. Setup + Foundational → Configuration baseline ready
2. Add US1 → Homepage LCP/CLS optimized → Lab audit validation (key milestone!)
3. Add US2 → Prefetch disabled → Network verification
4. Add US3 → Booking flow confirmed intact → Ready for staging
5. Add Polish → Hydration fixed, payload reduced, full validation

### Parallel Team Strategy

With multiple developers after Phase 2:

- Developer A: User Story 1 (Phase 3) — LCP/CLS/TBT fixes
- Developer B: User Story 2 (Phase 4) — Prefetch fixes
- Developer C: User Story 3 (Phase 5) — starts after A+B complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Lighthouse Mobile emulation (4x CPU slowdown, slow 4G) is the official pass/fail validator
- Desktop Lighthouse is supplementary only — does not determine pass/fail
- Final validation must run on staging/production-like infrastructure, not local Docker
- `?no-third-party=1` diagnostic mode is verification-only — do NOT re-implement (per spec clarification)
- All SEO tags must remain server-rendered and dashboard-driven
- All internal links must remain crawlable `<a href>` elements
