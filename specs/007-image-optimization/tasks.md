# Tasks: Image Optimization

**Input**: Design documents from `/specs/007-image-optimization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and confirm no regressions before image changes

- [X] T001 Verify `@nuxt/image` is installed and `nuxt.config.ts` image provider is set to `ipx` with `quality: 80`
- [X] T002 [P] Run `npm run lint` and confirm current codebase passes linting with zero errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Audit all existing image references so conversions and deletions are safe

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Search codebase for all direct references to `public/images/*.png` files (Vue templates, CSS, SCSS, JS, TS)
- [X] T004 [P] Search codebase for all `<img>` tags in `components/**/*.vue` to identify API vs local images
- [X] T005 Create inventory of PNG files >100KB with current sizes and their reference locations in `specs/007-image-optimization/png-inventory.md`
- [X] T006 Verify that `public/images/` files referenced by third-party integrations, manifest, favicon, or app icons are flagged as "DO NOT DELETE"
- [X] T007 Confirm all API-image components already use plain `<img>` (not `<NuxtImg>`) per the 33-file prior fix

**Checkpoint**: Foundation ready — complete reference inventory exists, safe-to-delete vs must-keep PNGs are classified, API image constraint verified.

---

## Phase 3: User Story 1 - Faster Hero Banner Loading (Priority: P1) 🎯 MVP

**Goal**: Add `decoding="async"` to non-first hero banner slides so they do not block the main thread.

**Independent Test**: Load the homepage on a throttled connection and verify in DevTools Performance tab that non-first slides decode off the main thread.

### Implementation for User Story 1

- [X] T008 [US1] Add `:decoding="index === 0 ? 'auto' : 'async'"` to `<img>` tags in `components/Home/MainBanner/index.vue`
- [X] T009 [US1] Verify first slide retains `fetchpriority="high"` and `loading="eager"` (no regression)
- [X] T010 [US1] Run `npm run lint` after US1 changes and fix any lint errors

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Hero banner first slide remains high-priority; other slides decode asynchronously.

---

## Phase 4: User Story 2 - Consistent Tour Card Display (Priority: P2)

**Goal**: Add explicit dimensions, aspect ratio, and async decoding to tour card images to eliminate layout shifts.

**Independent Test**: Load a tours listing page with tour cards on a throttled connection and verify in DevTools that the image placeholder area is reserved before the image loads (no CLS).

### Implementation for User Story 2

- [X] T011 [P] [US2] Add `decoding="async"` and `style="aspect-ratio: 400/194;"` to `<img>` tags in `components/Shared/TourCard.vue`
- [X] T012 [P] [US2] Verify `width="400"` and `height="194"` attributes are present on tour card `<img>` tags in `components/Shared/TourCard.vue`
- [X] T013 [US2] Apply same width/height/aspect-ratio/decoding fixes to `components/Shared/EgyptToursCard.vue`
- [X] T014 [US2] Apply same width/height/aspect-ratio/decoding fixes to `components/Shared/EventCard.vue`
- [X] T015 [US2] Run `npm run lint` after US2 changes and fix any lint errors

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Tour card images reserve space before loading; no layout shift occurs.

---

## Phase 5: User Story 3 - Smaller Overall Page Size (Priority: P3)

**Goal**: Convert local PNG images >100KB to WebP (quality 80), update all references, and delete originals.

**Independent Test**: Compare total image payload of a page before and after conversion. Target: ≥80% reduction in local static image payload.

### Implementation for User Story 3

- [X] T016 [P] [US3] Convert `public/images/wheelChair.png` (2.4MB) → `assets/imgs/wheelChair.webp` using sharp (ipx proxy constraint)
- [X] T017 [P] [US3] Convert `public/images/mainBanner.png` (2.0MB) → deleted (unused asset)
- [X] T018 [P] [US3] Convert `public/images/authHero.png` (891KB) → `public/images/authHero.webp` using sharp
- [X] T019 [P] [US3] Convert `public/images/map.png` (819KB) → `public/images/map.webp` using sharp
- [X] T020 [P] [US3] Convert `public/images/Cairo_Egypt_Unsplash.png` (718KB) → deleted (unused asset)
- [X] T021 [P] [US3] Convert `public/images/heroMuseum.png` (692KB) → deleted (unused asset)
- [X] T022 [P] [US3] Convert `public/images/faqs-banner.png` (630KB) → `public/images/faqs-banner.webp` using sharp
- [X] T023 [P] [US3] Convert `public/images/certified-logo.png` (560KB) → `public/images/certified-logo.webp` using sharp
- [X] T024 [P] [US3] Convert `public/images/blogsHero.png` (526KB) → deleted (unused asset)
- [X] T025 [P] [US3] Convert `public/images/giza.png` (340KB) → deleted (unused asset)
- [X] T026 [P] [US3] Convert `public/images/certified.png` (295KB) → `public/images/certified.webp` using sharp
- [X] T027 [P] [US3] Convert `public/images/aboutusmainbanner.png` (284KB) → deleted (unused asset)
- [X] T028 [P] [US3] Convert `public/images/realLocation.png` (248KB) → deleted (unused asset)
- [X] T029 [P] [US3] Convert `public/images/certified_footer_white.png` (183KB) → `public/images/certified_footer_white.webp` using sharp
- [X] T030 [P] [US3] Convert `public/images/museums.png` (182KB) → deleted (unused asset)
- [X] T031 [P] [US3] Convert `public/images/shorts.png` (164KB) → `public/images/shorts.webp` using sharp
- [X] T032 [P] [US3] Convert `public/images/certification.png` (133KB) → deleted (unused asset)
- [X] T033 [P] [US3] Convert `public/images/tiktok.png` (132KB) → `public/images/tiktok.webp` using sharp
- [X] T034 [P] [US3] Convert `public/images/cri-container.png` (118KB) → `public/images/cri-container.webp` using sharp
- [X] T035 [US3] Update all Vue component references from `.png` to `.webp` for converted images (e.g., `components/Home/MainBanner/index.vue`, `components/Auth/index.vue`, etc.)
- [X] T036 [US3] Update all CSS/SCSS references from `.png` to `.webp` for converted images (e.g., `assets/styles/main.scss` or component styles)
- [X] T037 [US3] Update any JavaScript/TypeScript string references to `.png` images
- [X] T038 [US3] Delete all converted original `.png` files from `public/images/` (excluding third-party-required files flagged in T006)
- [X] T039 [US3] Verify build passes (`npm run build`) with no broken image references
- [X] T040 [US3] Run `npm run lint` after US3 changes and fix any lint errors

**Checkpoint**: All user stories should now be independently functional. Local image payload reduced by ≥80%; no broken references remain.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, performance validation, and cleanup

- [X] T041 [P] Run Lighthouse audit on homepage (mobile emulation) and record LCP, CLS, and total image payload
- [X] T042 [P] Run Lighthouse audit on a tour listing page (mobile emulation) and record CLS from tour cards
- [X] T043 Verify no layout shift when tour card images load on a throttled connection
- [X] T044 Verify hero banner loads fast on throttled connection; non-first slides do not block main thread
- [X] T045 [P] Compare before/after total image payload and confirm ≥80% reduction
- [X] T046 Verify no PNG files >100KB remain in `public/images/` (except flagged must-keep files)
- [X] T047 Verify all API-image components still use plain `<img>` and do NOT use `<NuxtImg>` (regression check)
- [X] T048 Update `specs/007-image-optimization/png-inventory.md` with conversion results (before/after sizes, remaining files)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — No dependencies on US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Depends on reference inventory from Phase 2; no dependencies on US1/US2

### Within Each User Story

- US1: Single component change — no internal dependencies
- US2: Multiple component changes can run in parallel (T011–T014)
- US3: All conversions (T016–T034) can run in parallel; reference updates (T035–T037) depend on conversions; deletion (T038) depends on reference updates

### Parallel Opportunities

- T003 and T004 (codebase audit) can run in parallel
- T016–T034 (all image conversions) can run in parallel
- T035–T037 (reference updates) can run in parallel once conversions are done
- T041 and T042 (Lighthouse audits) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (hero banner async decoding)
4. **STOP and VALIDATE**: Test homepage LCP and main-thread decoding
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (hero banner)
   - Developer B: User Story 2 (tour cards)
   - Developer C: User Story 3 (image conversions)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
