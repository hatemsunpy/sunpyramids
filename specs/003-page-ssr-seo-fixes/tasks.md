# Tasks: Page-Level SSR SEO Fixes

**Input**: Design documents from `/specs/003-page-ssr-seo-fixes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in specification. Validation via curl-based smoke tests per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Nuxt 3 project**: `pages/`, `components/`, `composables/` at repository root
- All paths relative to `D:\Sun Pyramids\sun pyramids tours - Web\sun-front\`
- Phase 2 foundational fixes (composables/useSeo.js, utils/seo.js, composables/useApi.js) are prerequisites

---

## Phase 1: Setup (Development Environment)

**Purpose**: Ensure dev server runs and prerequisites are met

- [ ] T001 Verify dev server starts with `npm run dev` and serves pages at `http://localhost:3000/`
- [ ] T002 [P] Confirm all 7 supported locales are accessible: `/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`

---

## Phase 2: Foundational (Reference Pattern Review)

**Purpose**: Review working reference implementations before modifying broken pages

**⚠️ CRITICAL**: Understand the correct SSR-blocking pattern before making any changes

- [ ] T003 Review correct SEO pattern in `pages/faqs.vue` (lines 57-72): top-level `await getData()` + direct `addSeo()` call. This is the reference pattern all fixes must replicate.
- [ ] T004 [P] Review correct SEO pattern in `pages/blogs/all-blogs.vue` (lines 64, 87-90): confirms the same top-level `await` + direct `addSeo()` pattern.
- [ ] T005 [P] Confirm `pages/egypt-tours/multi-days-tours/index.vue` already follows the correct pattern (top-level `await` at line 24, direct `addSeo()` at line 28) — no fix needed, verification only.

**Checkpoint**: Reference patterns understood. The fix is: remove async wrapper function → inline top-level `await getData()` → call `addSeo()` directly on the next line → wrap in try/catch.

---

## Phase 3: User Story 1 - Search Engines Receive Complete SEO Metadata From All Pages (Priority: P1) 🎯 MVP

**Goal**: Fix SSR blocking on 7 content pages so crawlers receive complete SEO tags in the initial HTML response

**Independent Test**: `curl` each of the 7 fixed pages and confirm `<title>`, `<meta name="description">`, OG tags, Twitter tags, canonical, hreflang, and schema present in raw HTML.

### Implementation for User Story 1

**Pattern A — Remove async wrapper, add top-level await + direct addSeo:**

- [ ] T006 [US1] Fix `pages/contact-us.vue` (lines 22-32): remove `getContactData` async wrapper function, replace with top-level `await getData('pages/contact-us?includes=seo')` followed by direct `addSeo(contactData.value)` per page-template-contract.md reference implementation
- [ ] T007 [US1] Add try/catch error boundary around the SEO fetch in `pages/contact-us.vue`: catch block calls `addSeo({ meta_title: 'Sun Pyramids Tours' })` and `console.warn()` per FR-011
- [ ] T008 [P] [US1] Fix `pages/about-us.vue` (lines 42-51): remove `getAboutData` async wrapper function, replace with top-level `await getData('pages/about-us?includes=seo,metas')` followed by direct `addSeo(aboutData.value)`
- [ ] T009 [P] [US1] Add try/catch error boundary around the SEO fetch in `pages/about-us.vue`
- [ ] T010 [US1] Simplify `pages/tour/[id].vue` (lines 38-46): replace `watch(tour, callback, { immediate: true })` with direct `addSeo(tour.value)` call immediately after the existing top-level `await` at line 36. Remove the watcher block.
- [ ] T011 [US1] Add try/catch error boundary around the SEO-relevant data in `pages/tour/[id].vue`: if `tour.value` is null/undefined after fetch, call `addSeo({ meta_title: 'Sun Pyramids Tours' })`
- [ ] T012 [P] [US1] Fix `pages/egypt-travel-guide/index.vue` (lines 15-25): remove `getPlogPage` async wrapper function, replace with top-level `await getData("pages/blog?includes=seo")` followed by direct `addSeo(page.value)`. Note: inner `getData()` at line 19 also lacks `await` — fix both.
- [ ] T013 [P] [US1] Add try/catch error boundary around the SEO fetch in `pages/egypt-travel-guide/index.vue`
- [ ] T014 [P] [US1] Fix `pages/egypt-tours/nile-cruises/index.vue` (lines 20-30): remove `getNileDate` async wrapper function, replace with top-level `await getData('pages/nile-cruises?includes=seo')` followed by direct `addSeo(nileData.value)`
- [ ] T015 [P] [US1] Add try/catch error boundary around the SEO fetch in `pages/egypt-tours/nile-cruises/index.vue`
- [ ] T016 [P] [US1] Fix `pages/egypt-tours/shore-excursions/index.vue` (lines 19-29): remove `getShoreDate` async wrapper function, replace with top-level `await getData('categories/shore-excursions?includes=seo')` followed by direct `addSeo(shoreData.value)`
- [ ] T017 [P] [US1] Add try/catch error boundary around the SEO fetch in `pages/egypt-tours/shore-excursions/index.vue`
- [ ] T018 [P] [US1] Fix `pages/egypt-travel-guide/[cate]/index.vue` (lines 17-38): remove `getPage` async wrapper function, replace with top-level `await getData(...)` followed by direct `addSeo(page.value)` inside the existing `if (res.data.data[0])` check; keep the `else { abort_404() }` branch
- [ ] T019 [P] [US1] Add try/catch error boundary around the SEO fetch in `pages/egypt-travel-guide/[cate]/index.vue`
- [ ] T020 [US1] Run US1 verification: `curl` each of the 7 fixed pages and confirm `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta name="twitter:title">`, `<link rel="canonical">`, `<link rel="alternate">`, `<script type="application/ld+json">` present in raw HTML per GATE-01

**Checkpoint**: All 7 content pages serve complete SEO metadata in initial HTML. Crawlers and social bots receive valid tags.

---

## Phase 4: User Story 2 - Homepage Serves Complete SEO Metadata to Crawlers (Priority: P1)

**Goal**: Restore homepage SEO integration that is currently commented out

**Independent Test**: `curl http://localhost:3000/` and confirm complete SEO metadata in raw HTML, sourced from the Home dashboard entry.

### Implementation for User Story 2

- [ ] T021 [US2] Uncomment and fix SEO block in `pages/index.vue` (lines 50-57): uncomment the `getData('pages/home?includes=seo')` call, use the correct top-level `await` pattern (not `.then()` chain), add direct `addSeo(homeData.value)` call. Ensure the `getData` + `addSeo` pattern matches the page-template-contract.md reference.
- [ ] T022 [US2] Add try/catch error boundary around the SEO fetch in `pages/index.vue`: catch block calls `addSeo({ meta_title: 'Sun Pyramids Tours' })` per FR-011
- [ ] T023 [US2] Verify homepage SEO: `curl http://localhost:3000/ | grep '<title>'` returns title from Home dashboard entry (not empty, not generic fallback unless API fails)

**Checkpoint**: Homepage serves complete SEO metadata. Brand search presence and social sharing previews work.

---

## Phase 5: User Story 3 - Homepage Loads Without Wasting Bandwidth On Unvisited Pages (Priority: P2)

**Goal**: Disable global NuxtLink prefetch so homepage initial load only fetches one HTML document

**Independent Test**: DevTools Network tab filtered for `text/html` — only one document (the homepage) fetched on initial load.

### Implementation for User Story 3

- [ ] T024 [US3] Add `experimental: { defaults: { nuxtLink: { prefetch: false } } }` to `nuxt.config.ts` per prefetch-config-contract.md. Place inside the existing `defineNuxtConfig({})` block.
- [ ] T025 [US3] Test header navigation UX after prefetch disable: navigate between main sections (Home → Tours → Contact → About) on simulated Fast 3G throttling and verify each navigation completes within 500ms of click. Document any lag and the measured timing.
- [ ] T026 [US3] If header navigation feels slow after T024, selectively re-enable prefetch ONLY on header `<NuxtLink>` components by adding `:prefetch="true"`. Do NOT re-enable prefetch on: tour cards, blog cards, destination cards, category cards, footer links, related tours, or any card/listing component per prefetch-config-contract.md allowed/blocked lists.

**Checkpoint**: Homepage loads only one text/html document. No wasted bandwidth on unvisited pages. Navigation UX preserved.

---

## Phase 6: User Story 4 - All Navigation Links Are Visible To Search Engines (Priority: P2)

**Goal**: Verify all internal links remain crawlable `<a href="">` elements after prefetch changes

**Independent Test**: View page source (`Ctrl+U`) and confirm all card links are `<a href="...">` elements. Disable JavaScript and confirm navigation works.

### Implementation for User Story 4

- [ ] T027 [US4] Verify homepage card links in HTML source: `curl http://localhost:3000/` and grep for `<a href="..."` elements matching tour cards, blog cards, destination cards, and category cards. Confirm every card has a valid hyperlink.
- [ ] T028 [US4] Disable JavaScript in browser and verify navigation: click header nav links, tour cards, blog cards — all should navigate to target pages successfully.
- [ ] T029 [US4] Confirm prefetch disable (T024) did not alter any link DOM: compare `curl` output before and after the config change — `<NuxtLink>` still renders as `<a href="">`. No links removed, hidden, or converted to JS-only handlers.

**Checkpoint**: All internal links are crawlable and functional without JavaScript. Zero link degradation from prefetch optimization.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation across all quality gates, locales, and error scenarios

- [ ] T030 [P] Run OG attribute verification (GATE-02): `curl http://localhost:3000/<page> | grep "og:" | grep 'name="og:"'` — must return nothing for contact-us, about-us, tour detail, homepage
- [ ] T031 [P] Run meta keywords verification (GATE-03): `curl http://localhost:3000/<page> | grep -i "keywords"` — must return nothing for all fixed pages
- [ ] T032 [P] Run API domain check (GATE-04): `curl http://localhost:3000/ | grep "sunpyramidtours.com"` — confirm no backend/API domain in hreflang/canonical/og:url hrefs
- [ ] T033 [P] Run schema safety verification (GATE-05): `curl http://localhost:3000/ | grep 'application/ld+json'` — confirm valid JSON-LD script tag present; `curl` a page with malformed schema and confirm no broken JSON output
- [ ] T034 [P] Run hreflang verification (GATE-06): `curl http://localhost:3000/ | grep "hreflang"` — zero `hreflang="en"`, x-default present per Phase 2 SC-001
- [ ] T035 Run cross-locale verification (SC-007): loop over all 7 locales (`/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`) and verify each returns locale-specific `<title>` and `<meta name="description">`
- [ ] T036 Verify already-correct pages still pass: `curl` faqs (`/faqs`), blogs listing (`/blogs/all-blogs`), blog detail (`/blog/<slug>`), one-day-tours, and multi-days-tours — confirm SEO tags still present and unchanged
- [ ] T037 Verify component-level SEO: confirm `components/Event/index.vue` (line 38, 54) and `components/MarktingPages/index.vue` (line 19, 26) still call `addSeo()` correctly. Verify their parent pages (`pages/event/[slug].vue`, `pages/egypt-tours/[slug].vue`) properly await data before rendering these components.
- [ ] T038 Run API 500 resilience verification: simulate API failure (stop backend or mock 500), curl any fixed page — expect status 200, safe fallback title "Sun Pyramids Tours", no broken tags, no truncated output per FR-011
- [ ] T039 Run full quickstart.md validation procedure (Steps 1-8) from `specs/003-page-ssr-seo-fixes/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — modifies 7 page files across `pages/`
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — modifies `pages/index.vue`
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) — modifies `nuxt.config.ts`. Can run in parallel with US1, US2, US4.
- **User Story 4 (Phase 6)**: Depends on US3 completion (must verify after prefetch change) — reads (does not modify) pages to verify links.
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — touches 7 page files
- **US2 (P1)**: Independent of US1 — touches `pages/index.vue` only; no file overlap with US1
- **US3 (P2)**: Independent of US1/US2 — touches `nuxt.config.ts` only
- **US4 (P2)**: Depends on US3 (verifies link state after prefetch change) — read-only verification

### Within Each User Story

- Understand current anti-pattern → Remove wrapper → Add top-level await → Add error boundary → Verify
- Each page in US1 is independently fixable (marked [P] where files don't overlap)
- Fix-and-error-boundary pairs for the same file must be sequential (T006→T007, T008→T009, etc.)

### Parallel Opportunities

- Phase 2: T003, T004, T005 can all run in parallel (different files)
- US1: Fix pairs for different pages can run in parallel: (T006+T007), (T008+T009), (T012+T013), (T014+T015), (T016+T017), (T018+T019) — all touch different files
- US1 + US2 + US3: Can all run in parallel (zero file overlap between phases)
- Phase 7: T030-T034 can all run in parallel (independent curl commands)

---

## Parallel Example: User Story 1 — Fix Multiple Pages Concurrently

```bash
# These page pairs can be fixed in parallel (all touch different files):
# Developer A:
Task: "T006 [US1] Fix contact-us.vue"
Task: "T007 [US1] Add error boundary to contact-us.vue"

# Developer B:
Task: "T008 [US1] Fix about-us.vue"
Task: "T009 [US1] Add error boundary to about-us.vue"

# Developer C:
Task: "T012 [US1] Fix egypt-travel-guide/index.vue"
Task: "T013 [US1] Add error boundary to egypt-travel-guide/index.vue"

# Developer D:
Task: "T014 [US1] Fix nile-cruises/index.vue"
Task: "T015 [US1] Add error boundary to nile-cruises/index.vue"
```

---

## Parallel Example: Cross-Phase Execution

```bash
# These phases touch completely different files — all can run concurrently:
# Developer A: User Story 1 (7 files in pages/)
# Developer B: User Story 2 (pages/index.vue only — not in US1 scope)
# Developer C: User Story 3 (nuxt.config.ts only)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (fix 7 content pages)
4. **STOP and VALIDATE**: `curl` each of the 7 pages — confirm complete SEO metadata
5. This alone fixes SSR blocking on all non-homepage content pages

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (content pages) → Test independently → 7 pages now crawlable (MVP!)
3. Add US2 (homepage) → Test independently → Homepage crawlable
4. Add US3 (prefetch) → Test independently → Bandwidth savings on homepage
5. Add US4 (link audit) → Test independently → Confirmed crawlable links preserved
6. Polish → Full cross-locale validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (7 content pages — can self-parallelize the per-page fixes)
   - Developer B: User Story 2 (homepage) + User Story 4 (link audit)
   - Developer C: User Story 3 (prefetch config)
3. All converge on Polish phase for cross-validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test framework required — validation via curl-based smoke tests per quickstart.md
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- The fix pattern is identical for all broken pages — understand it once in Phase 2, then apply mechanically
- `pages/egypt-tours/multi-days-tours/index.vue` is already correct per Phase 2 research — verify, don't fix
- `pages/egypt-travel-guide/index.vue` has a double bug (outer call + inner getData both un-awaited) — need both fixes
- Phase 2 prerequisite: `composables/useSeo.js`, `utils/seo.js`, and `composables/useApi.js` must have the Phase 2 foundational fixes applied
