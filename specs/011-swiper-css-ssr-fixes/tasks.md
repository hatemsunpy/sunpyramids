# Tasks: Swiper CSS Deduplication & SSR Blocking Removal

**Input**: Design documents from `/specs/011-swiper-css-ssr-fixes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are OPTIONAL — verification is via manual build inspection, DevTools, and Lighthouse. No automated test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Verification & Baseline)

**Purpose**: Confirm current state and capture baseline metrics before any changes

- [x] T001 Run `npm run build` and confirm production build succeeds with zero errors
- [x] T002 [P] Run Lighthouse on homepage and record baseline FCP / TTFB / SEO scores
- [x] T003 [P] Search codebase for all `import 'swiper/css'` occurrences and record count + file paths
- [x] T004 Verify `plugins/third-party-scripts.client.ts` exists and contains TrustIndex detection logic

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare for safe parallel execution of all three user stories

**⚠️ CRITICAL**: All changes in this feature are independent, but this phase ensures the codebase is in a known-good state before any modifications

- [x] T005 [P] Verify `nuxt.config.ts` `css` array currently contains only `~/assets/styles/main.scss`
- [x] T006 [P] Verify `components/Header/index.vue` contains `await getnationalities()` at line ~252
- [x] T007 [P] Verify `pages/index.vue` contains immediate TrustIndex script injection in `onMounted`

**Checkpoint**: All verification tasks complete — baseline confirmed, no blockers

---

## Phase 3: User Story 1 — Faster Homepage Load (Priority: P1) 🎯 MVP

**Goal**: Remove the immediate TrustIndex script injection from `pages/index.vue` and rely on the existing deferred third-party script plugin, improving FCP by ≥100ms

**Independent Test**: Open homepage in incognito DevTools → Network tab → filter `trustindex` → confirm no request until 5s idle OR user interaction. Add `?no-third-party` → confirm no request at all.

### Implementation for User Story 1

- [x] T008 [US1] Remove the `onMounted` TrustIndex script injection block from `pages/index.vue` (lines 61–77)
- [x] T009 [US1] Verify `#home-reviews` container element still exists in `pages/index.vue` template so plugin can detect it
- [x] T010 [US1] Confirm `plugins/third-party-scripts.client.ts` watches for `#home-reviews` and loads TrustIndex after interaction/idle
- [x] T011 [US1] Test `?no-third-party` query parameter prevents TrustIndex loading entirely

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 — Consistent CSS Loading (Priority: P2)

**Goal**: Move Swiper CSS imports from ~25 individual components to `nuxt.config.ts` global CSS, eliminating duplication

**Independent Test**: Run `npm run build` → inspect `.output/public/_nuxt/*.css` → confirm Swiper CSS appears exactly once. Search component sources → confirm zero `import 'swiper/css'` statements remain.

### Implementation for User Story 2

- [x] T012 [P] [US2] Add Swiper CSS modules to `nuxt.config.ts` `css` array: `swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`
- [x] T013 [P] [US2] Remove `import 'swiper/css'` from `components/[component-a].vue`
- [x] T014 [P] [US2] Remove `import 'swiper/css'` from `components/[component-b].vue`
- [x] T015 [P] [US2] Remove `import 'swiper/css'` from `components/[component-c].vue`
- [x] T016 [P] [US2] Remove `import 'swiper/css'` from `components/[component-d].vue`
- [x] T017 [P] [US2] Remove `import 'swiper/css'` from `components/[component-e].vue`
- [x] T018 [P] [US2] Remove `import 'swiper/css/pagination'` from all components that import it
- [x] T019 [P] [US2] Remove `import 'swiper/css/navigation'` from all components that import it
- [x] T020 [US2] Run `npm run build` and verify Swiper carousels (tour cards, banners, galleries, related tours) render identically
- [x] T021 [US2] Confirm production CSS bundle contains Swiper CSS content exactly once

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 — Unblocked Server-Side Rendering (Priority: P2)

**Goal**: Change `await getnationalities()` in `components/Header/index.vue` to client-side fire-and-forget, reducing TTFB by ≥50ms

**Independent Test**: `curl -s http://localhost:3000/ | head -20` → response should return immediately without waiting for nationality API. Open any form with nationality dropdown → dropdown populates correctly after client-side hydration.

### Implementation for User Story 3

- [x] T022 [US3] Change `await getnationalities()` in `components/Header/index.vue` to fire-and-forget client-side only (wrap in `if (process.client)` or move to `onMounted`)
- [x] T023 [US3] Verify `sharedStore.js` `getnationalities()` still populates store correctly when called client-side
- [ ] T024 [US3] Test nationality dropdown in booking/inquiry forms across multiple pages
- [ ] T025 [US3] Confirm `curl http://localhost:3000/` returns HTML immediately without awaiting nationality API

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, metrics capture, and documentation

- [ ] T026 [P] Run Lighthouse on homepage and record post-change FCP / TTFB / SEO scores
- [ ] T027 [P] Run Lighthouse on a tour detail page and confirm Swiper carousels render with zero regressions
- [x] T028 Update `docs/performance-optimization-plan.md` to mark Phase 010 remaining tasks as complete
- [x] T029 [P] Verify `npm run build` still succeeds with zero errors and zero new warnings
- [ ] T030 Run quickstart.md validation steps (all 5 sections)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — confirms baseline
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - **US1 (P1)**: Can start immediately after Foundational — is the MVP
  - **US2 (P2)**: Can start in parallel with US1 (different files)
  - **US3 (P2)**: Can start in parallel with US1/US2 (different files)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — self-contained change to `pages/index.vue`
- **User Story 2 (P2)**: No dependencies on other stories — self-contained changes to `nuxt.config.ts` + component CSS imports
- **User Story 3 (P2)**: No dependencies on other stories — self-contained change to `components/Header/index.vue`

### Within Each User Story

- US1: Remove injection → verify plugin detection → test `?no-third-party`
- US2: Add global CSS → remove component imports → build & verify
- US3: Change SSR await to client-side → test form dropdown → verify curl response

---

## Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel (independent verification tasks)
- **Phase 2**: T005, T006, T007 can run in parallel (independent verification tasks)
- **Phase 3–5**: All three user stories can be implemented in parallel once Phase 2 completes:
  - Developer A: US1 (TrustIndex deferral)
  - Developer B: US2 (Swiper CSS deduplication)
  - Developer C: US3 (Header SSR unblock)
- **Phase 6**: T026, T027, T029 can run in parallel (independent verification tasks)

---

## Parallel Example: User Story 2 (Swiper CSS)

```bash
# Launch all component import removals together (different files, no conflicts):
Task: "Remove swiper/css from components/HomeBanner.vue"
Task: "Remove swiper/css from components/TourCard.vue"
Task: "Remove swiper/css from components/RelatedTours.vue"
Task: "Remove swiper/css from components/GallerySlider.vue"
# ... etc for all ~25 components
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (TrustIndex deferral — highest impact, smallest change)
4. **STOP and VALIDATE**: Test homepage FCP improvement
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Verify Swiper carousels
4. Add User Story 3 → Test independently → Verify form dropdowns
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (pages/index.vue)
   - Developer B: User Story 2 (nuxt.config.ts + ~25 components)
   - Developer C: User Story 3 (components/Header/index.vue)
3. Stories complete and integrate independently
4. Phase 6 (Polish) done together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests needed — verification is via build inspection, DevTools, Lighthouse, and manual form testing
- Commit after each user story or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
