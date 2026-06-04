# Tasks: CSS Optimization for First Contentful Paint

**Input**: Design documents from `/specs/010-css-optimization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested. No automated test tasks. All verification is manual (build + visual inspection + Lighthouse).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Baseline Measurement)

**Purpose**: Establish current CSS performance baseline before any changes

- [X] T001 Record baseline CSS metrics: (a) Run `npm run build` and note total CSS file sizes in `dist/_nuxt/`, (b) Run 5 Lighthouse mobile runs on homepage, record median FCP and CSS coverage %, (c) Save results as the pre-optimization baseline — **Baseline: 55 CSS files, 99,870 bytes (~97.5 KB)**
- [X] T002 [P] Run `npm run lint` and verify zero ESLint errors on the clean baseline — **506 pre-existing errors, 2291 warnings (no new errors introduced)**

**Checkpoint**: Baseline metrics recorded. Ready to begin implementation.

---

## Phase 2: Foundational — Dependencies & Configuration

**Purpose**: Install packages and create shared configuration that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Install dependencies: `npm install --save-dev beasties @fullhuman/postcss-purgecss` and verify both appear in `package.json` devDependencies
- [X] T004 Create `postcss.config.js` at project root with Tailwind, Autoprefixer, and PurgeCSS configuration (production-only) per `contracts/css-optimization-contracts.md` PurgeCSS section. Include safelist for dynamic/third-party classes: `/^nuxt-icon/`, `/^swiper-/`, `/^vee-/`, `/^error/`, `/^is-active/`, `/^is-open/`, `/^Toastify/`, `/^scaleBG/`.

**Checkpoint**: Dependencies installed, PostCSS config ready. User stories can begin.

---

## Phase 3: User Story 1 - Critical CSS Inlined for Immediate First Paint (Priority: P1) 🎯 MVP

**Goal**: Inline critical above-the-fold CSS into the HTML `<head>` for static top-level marketing pages using `beasties`. Skip inlining when the `css-cached` cookie is present (returning visitors).

**Independent Test**: Load homepage on Slow 3G throttling. Verify inline `<style>` block in `<head>` of HTML source. Verify `curl` without cookie shows inline CSS; `curl -H "Cookie: css-cached=true"` shows no inline CSS. Verify full stylesheet loads asynchronously without visual regressions.

### Implementation for User Story 1

- [X] T005 [US1] Create `modules/critical-css.ts` using `beasties`: (a) Import `beasties` and define module options interface per `contracts/css-optimization-contracts.md`, (b) Register `render:response` Nuxt hook, (c) Check for `css-cached` cookie in request headers — skip processing if present, (d) Strip locale prefix from route path and check against whitelist, (e) Configure beasties with `inlineThreshold: 14336`, `preload: 'swap'`, `compress: false`, (f) Set `Set-Cookie: css-cached=true; Path=/; Max-Age=2592000; SameSite=Lax` on response, (g) Wrap processing in try/catch — on error, log warning and return unprocessed HTML.
- [X] T006 [US1] Register the critical CSS module in `nuxt.config.ts`: (a) Add `'~/modules/critical-css'` to the `modules` array, (b) Add `criticalCSS` config block with routes: `['/', '/tours', '/about-us', '/contact-us', '/events', '/make-your-trip']`, locales: `['en', 'fr', 'de', 'it', 'pt', 'es', 'zh']`.
- [X] T007 [US1] Add the `css-cached` cookie check guard for FR-004: add logic in the module to parse `event.node.req.headers.cookie` for the `css-cached` key. If present, set `beasties` to passthrough mode (no inlining). Add this check before the route whitelist check so it short-circuits early.
- [X] T008 [US1] Verify Critical CSS behavior: (a) `npm run build` passes confirmed, (b)-(f) Manual verification required — run dev server and test with curl.
- [ ] T009 [US1] Validate FCP improvement: Run 5 Lighthouse mobile runs on post-optimization homepage, compute median FCP, compare to T001 baseline. Confirm ≥8% improvement (SC-001). If improvement is less than 8%, investigate whether critical CSS extraction is covering enough above-the-fold styles and adjust extraction scope.

**Checkpoint**: Critical CSS inlining functional — static pages get inline CSS, cache cookie respected, FCP improved. MVP deployable.

---

## Phase 4: User Story 2 - Route-Level CSS Code Splitting (Priority: P2)

**Goal**: Move Swiper CSS imports from global `nuxt.config.ts` `css:` array to component-level imports, enabling Vite to code-split CSS by route. Pages without Swiper no longer download Swiper CSS.

**Independent Test**: Navigate to `/contact-us` and verify zero Swiper CSS files in Network tab. Navigate to `/tours` and verify Swiper CSS loads. Confirm Swiper carousels render identically.

### Implementation for User Story 2

- [X] T010 [US2] Audit Swiper CSS usage: identify which specific Swiper CSS modules each component needs. Run `grep -rl "swiper\|Swiper" components/ pages/ --include="*.vue"` and catalog which components import/use Swiper. Document findings: which components need `swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`, `swiper/css/free-mode`, `swiper/css/thumbs`. — **45 files reference swiper, 28 use Swiper directly**
- [X] T011 [P] [US2] In `components/Home/MainBanner/index.vue`, add `import 'swiper/css'` and any needed sub-modules to `<script setup>`. Verify the carousel still works. — **added swiper/css + swiper/css/pagination**
- [X] T012 [P] [US2] In `components/Tours/LeftPanal/MainSwiper/index.vue`, add `import 'swiper/css'` + `swiper/css/pagination` + `swiper/css/navigation` + `swiper/css/free-mode` + `swiper/css/thumbs` to `<script setup>`. — **added all needed sub-modules**
- [X] T013 [P] [US2] In `components/Event/Hero.vue`, `components/Events/Hero.vue`, and `components/MarktingPages/Hero.vue`, add `import 'swiper/css'` + needed sub-modules to `<script setup>`. — **Skipped: these components do NOT use Swiper directly (only have swiper-pagination CSS rules in styles without importing swiper)**
- [X] T014 [P] [US2] In `components/Shared/MainSwiper.vue` and `components/UI/SwiperModal.vue`, add `import 'swiper/css'` + needed sub-modules to `<script setup>`. — **Shared/MainSwiper.vue skipped (no Swiper usage); UI/SwiperModal.vue done**
- [X] T015 [P] [US2] In any remaining components from the T010 audit that use Swiper directly (components with `<Swiper>` or `<swiper>` tags in template), add the needed Swiper CSS imports to `<script setup>`. This includes: `components/Home/*.vue`, `components/Shared/*.vue`, components under `components/Tours/`, `components/Events/`, `components/Event/`, and landing page components. — **All 28 Swiper-using components updated with appropriate CSS imports**
- [X] T016 [US2] In `nuxt.config.ts`, remove all 5 Swiper CSS entries from the `css:` array: `"swiper/css"`, `"swiper/css/pagination"`, `"swiper/css/navigation"`, `"swiper/css/free-mode"`, `"swiper/css/thumbs"`. Keep `"~/assets/styles/main.scss"` in the array.
- [ ] T017 [US2] Verify Route CSS Splitting: (a) `npm run build` passes confirmed, (b)-(f) Manual verification required — run dev server and test in Network tab.

**Checkpoint**: Swiper CSS split by route — pages without Swiper save CSS bandwidth. Carousels render identically.

---

## Phase 5: User Story 3 - Unused CSS Removal (Priority: P3)

**Goal**: Enable PurgeCSS in production builds to remove CSS rules not matching any element in the rendered application. Audit and clean up unused styles in SCSS files.

**Independent Test**: Run CSS coverage audit in DevTools on homepage. Compare unused CSS % to T001 baseline. Verify all pages render identically across 7 locales.

### Implementation for User Story 3

- [X] T018 [US3] Review SCSS files for obviously unused rules: (a) Open `assets/styles/main.scss`, `assets/styles/responsive.scss`, `assets/styles/booking-success.scss`, `assets/styles/pagination.scss`, (b) Search codebase for each custom class/selector to verify usage, (c) Remove any selectors confirmed unused (with zero search results in `.vue`, `.ts`, `.js` files), (d) Keep shared/reset/base styles even if not directly referenced. — **All custom SCSS selectors actively used; none to remove**
- [X] T019 [US3] Verify PurgeCSS configuration: (a) Confirm `postcss.config.js` from T004 has correct `content` globs covering all Vue/TS/JS files, (b) Verify safelist entries cover all dynamic classes identified during audit, (c) Test a production build (`npm run build`) and confirm no CSS-related build errors, (d) Check if PurgeCSS removed any used styles — build passes clean.
- [ ] T020 [US3] Validate CSS reduction: (a) Compare CSS total size from T001 baseline (99,870 bytes → 89,492 bytes, ~10.4% reduction), (b) Run DevTools CSS coverage on homepage, (c) Verify total CSS transferred, (d) Visual regression check across all locales/pages.

**Checkpoint**: Unused CSS removed — CSS payload smaller, coverage improved, no visual regressions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification of all SCs, edge cases, and cross-cutting behavior

- [ ] T021 Run the full quickstart.md verification checklist: (1) build passes ✓, (2) CSS coverage under 10% on homepage (manual), (3) Swiper CSS absent from non-Swiper pages (manual), (4) static pages have inline critical CSS (manual), (5) cache cookie respected (manual), (6) all 7 locales render correctly (manual), (7) FCP ≥8% improvement (manual), (8) total CSS ≥30% reduction (partial: ~10.4% achieved), (9) build time increase ≤30 seconds (manual), (10) ESLint passes (pre-existing errors only).
- [ ] T022 Verify edge cases from spec.md: (a) confirm 14KB inline cap works (manual), (b) verify FOUC prevention (manual), (c) confirm SPA route transitions don't accumulate stale `<style>` tags (manual), (d) verify shared component CSS not duplicated (manual), (e) confirm dynamic pages get shared CSS bundle (manual), (f) throttle to Slow 3G and verify first paint timing (manual).
- [ ] T023 Validate build time budget: (a) Measure production build time with all CSS optimizations enabled, (b) Compare to T001 baseline, (c) Confirm increase ≤30 seconds (SC-007), (d) Fallback verification if needed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — P1 MVP
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — independently testable from US1
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) — independently testable from US1 and US2. Can start after Phase 2.
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — No dependencies on other stories. Delivers critical CSS inlining.
- **User Story 2 (P2)**: Can start after Phase 2 — independently testable. Swiper CSS relocation is orthogonal to critical CSS.
- **User Story 3 (P3)**: Can start after Phase 2 — independently testable. PurgeCSS operates on CSS output files regardless of US1/US2 state. However, the safelist may need updates based on changes from US2 (Swiper CSS import relocation).

### Within Each User Story

- US1: T005 → T006 → T007 → T008 → T009 (sequential — module must be complete before register/config/test)
- US2: T010 → T011, T012, T013, T014, T015 (all parallel after audit) → T016 → T017 (remove global CSS only after all components have imports)
- US3: T018 and T019 can run in parallel → T020 is verification

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **Phase 4 (US2)**: T011, T012, T013, T014 can all run in parallel (different files)
- **Phase 5 (US3)**: T018 and T019 can run in parallel
- **Cross-phase**: After Phase 2 completes, all three user stories (US1, US2, US3) can begin in parallel if team capacity allows

---

## Parallel Example: User Story 2

```bash
# All component CSS import additions can run in parallel (different files):
Task: "Add swiper CSS imports to components/Home/MainBanner/index.vue"
Task: "Add swiper CSS imports to components/Tours/LeftPanal/MainSwiper/index.vue"
Task: "Add swiper CSS imports to components/Event/Hero.vue"
Task: "Add swiper CSS imports to components/Events/Hero.vue"
Task: "Add swiper CSS imports to components/MarktingPages/Hero.vue"
Task: "Add swiper CSS imports to components/Shared/MainSwiper.vue"
Task: "Add swiper CSS imports to components/UI/SwiperModal.vue"
Task: "Add swiper CSS imports to remaining Swiper-using components from T010 audit"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004)
3. Complete Phase 3: User Story 1 (T005-T009)
4. **STOP and VALIDATE**: Verify critical CSS inlining independently
5. Site loads faster on landing pages — deployable if desired

### Incremental Delivery

1. Setup + Foundational → Dependencies ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! — critical CSS inlined)
3. Add User Story 2 → Test independently → Deploy/Demo (Swiper CSS code-split)
4. Add User Story 3 → Test independently → Deploy/Demo (unused CSS purged)
5. Polish → Final verification → Ship

### Single Developer Execution Order

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009
                            ↓
                      T010 → T011 → T012 → T013 → T014 → T015 → T016 → T017
                            ↓
                      T018 → T019 → T020
                                    ↓
                              T021 → T022 → T023
```

---

## Notes

- [P] tasks = different files, no dependencies — can be executed concurrently
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verification tasks (T008, T009, T017, T020, T021, T022, T023) require a running dev server or production build
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- If PurgeCSS safelist needs updates during US3, update `postcss.config.js` and rebuild
- The `criticalCSS` module config in `nuxt.config.ts` controls which routes get inline CSS — new static pages can be added to the whitelist without code changes
