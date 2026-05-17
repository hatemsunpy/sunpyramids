# Tasks: Dynamic Sitemap Generation

**Input**: Design documents from `/specs/004-sitemap-generation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in specification. Validation via curl + XML schema checks per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Nuxt 3 project**: `server/routes/`, `server/utils/` at repository root
- All paths relative to `D:\Sun Pyramids\sun pyramids tours - Web\sun-front\`
- Phase 1-3 SEO fixes (specs/001, 002, 003) are prerequisites

---

## Phase 1: Setup (Development Environment)

**Purpose**: Ensure dev server runs and prerequisites are met

- [x] T001 Verify dev server starts with `npm run dev` and serves pages at `http://localhost:3000/`
- [x] T002 [P] Confirm Laravel API endpoints are accessible and return data: `curl https://sunpyramidtours.com/api/tours?page_limit=1`, `curl https://sunpyramidtours.com/api/blogs?page_limit=1`, `curl https://sunpyramidtours.com/api/pages?type=static`

---

## Phase 2: Foundational (Contracts & Utilities)

**Purpose**: Understand existing contracts and create shared utilities needed by all routes

**⚠️ CRITICAL**: Must complete before any sitemap route is created

- [x] T003 Review Phase 1 sitemap contract at `specs/001-seo-rendering-fix/contracts/sitemap-contract.md` — understand sitemap index structure, sub-sitemap URL patterns, validation rules, and exclusion criteria
- [x] T004 [P] Review i18n configuration in `nuxt.config.ts` to confirm all 7 supported locales (en, fr, de, it, pt, es, zh), Arabic exclusion, and English root-path (no `/en` prefix)
- [x] T005 [P] Review the Phase 4 sitemap route contract at `specs/004-sitemap-generation/contracts/sitemap-route-contract.md` — understand exact XML structure, API endpoint mapping, and error response format for each route
- [x] T006 Create shared sitemap utility in `server/utils/sitemap-helpers.ts` with: (a) `escapeXml(text)` — escapes `&`, `<`, `>`, `"`, `'` for XML safety, (b) `formatDate(date)` — returns YYYY-MM-DD string, (c) `buildUrl(locale, path)` — constructs full `https://sunpyramidstours.com/...` URL respecting locale prefix rules (no `/en` prefix), (d) `buildHreflangAlternate(locale, url, isXDefault)` — returns `<xhtml:link>` XML string

**Checkpoint**: Contracts understood, shared utility ready. All routes will use `server/utils/sitemap-helpers.ts`.

---

## Phase 3: User Story 1 - Search Engines Discover All Indexable Pages Via Sitemap (Priority: P1) 🎯 MVP

**Goal**: Create all 5 sitemap server routes so crawlers receive a valid sitemap index with 4 sub-sitemaps

**Independent Test**: `curl http://localhost:3000/sitemap.xml` returns a valid XML sitemap index with `<sitemap>` entries for pages, tours, blog, and categories. Each sub-sitemap returns valid XML with URLs and hreflang alternates.

### Implementation for User Story 1

- [x] T007 [US1] Create `server/routes/sitemap.xml.ts` — sitemap index route: return hardcoded XML sitemap index with 4 `<sitemap>` entries (pages, tours, blog, categories), each with `<loc>` using `https://sunpyramidstours.com` domain and `<lastmod>` as current date. Use `setHeader('content-type', 'application/xml; charset=utf-8')`. No API calls needed.
- [x] T008 [P] [US1] Create `server/routes/sitemap-pages.xml.ts` — pages sub-sitemap: fetch static pages from `/api/pages?type=static&includes=seo` and marketing pages from `/api/pages?type=marketing&includes=seo`, apply exclusion filters, generate `<url>` entries with hreflang alternates for all 7 supported locales, return valid XML urlset per sitemap-route-contract.md
- [x] T009 [P] [US1] Create `server/routes/sitemap-tours.xml.ts` — tours sub-sitemap: fetch from `/api/tours?includes=seo,destinations,translations&page_limit=500`, iterate all published tours, generate `<url>` with `<loc>`, `<lastmod>`, and `<xhtml:link>` hreflang alternates per available translation per sitemap-route-contract.md
- [x] T010 [P] [US1] Create `server/routes/sitemap-blog.xml.ts` — blog sub-sitemap: fetch from `/api/blogs?includes=seo,categories,translations&page_limit=500`, iterate published posts, generate `<url>` entries with hreflang alternates per sitemap-route-contract.md
- [x] T011 [P] [US1] Create `server/routes/sitemap-categories.xml.ts` — categories sub-sitemap: fetch from `/api/tour-categories?page_limit=100` and `/api/blog-categories?page_limit=100`, generate `<url>` entries for active categories with hreflang alternates per sitemap-route-contract.md
- [x] T012 [US1] Delete `public/sitemap.xml` — remove the static 820KB file to prevent route conflicts with dynamic server routes
- [x] T013 [US1] Run US1 verification: `curl http://localhost:3000/sitemap.xml` and confirm valid XML with 4 `<sitemap>` entries. `curl` each sub-sitemap and confirm valid XML with `<url>` entries, `<loc>` values, `<lastmod>` dates, and `<xhtml:link>` hreflang alternates per GATE-01

**Checkpoint**: All 5 sitemap routes functional. Crawlers receive valid sitemap index and sub-sitemaps.

---

## Phase 4: User Story 2 - Sitemap Reflects Current Content, Not Stale Snapshot (Priority: P1)

**Goal**: Verify dynamic data pipeline — sitemaps source live API data and reflect content changes without manual regeneration

**Independent Test**: Publish a new tour via dashboard, request `/sitemap-tours.xml`, confirm the new tour appears. Disable a tour, confirm it disappears.

### Implementation for User Story 2

- [ ] T014 [US2] Verify tours live data pipeline: publish a test tour via dashboard, `curl /sitemap-tours.xml` and confirm it appears with correct `<loc>`, `<lastmod>`, and hreflang alternates. Then disable the tour and confirm it disappears from the sitemap.
- [ ] T015 [P] [US2] Verify blog live data pipeline: publish a test blog post via dashboard, `curl /sitemap-blog.xml` and confirm it appears. Mark it noindex and confirm it disappears.
- [ ] T016 [P] [US2] Verify marketing page dynamic discovery: create a marketing page via dashboard, `curl /sitemap-pages.xml` and confirm it appears without any hardcoded slug reference in the route code. Verify new marketing pages are included automatically.
- [x] T017 [US2] Run cross-locale verification (SC-007): loop `curl` over all 7 supported locale prefixes (`/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`) in sub-sitemaps and confirm locale-specific URLs appear with correct hreflang values. Confirm English uses root path (no `/en` prefix). Confirm zero `/ar/` URLs.

**Checkpoint**: Sitemaps are dynamically sourced from API. Content changes reflected without manual intervention.

---

## Phase 5: User Story 3 - Sitemap Excludes Non-Indexable Content (Priority: P2)

**Goal**: Implement and verify exclusion rules — noindex, disabled, draft, checkout, and unsupported locales are absent from sitemaps

**Independent Test**: Verify `/ar` URLs, checkout URLs, disabled tours, and noindex-marked pages are absent from all sitemap responses.

### Implementation for User Story 3

- [x] T018 [US3] Implement exclusion filter function `shouldExclude(item)` in `server/utils/sitemap-helpers.ts`: checks (a) `item.seo?.robots === 'noindex'`, (b) `item.status !== 'published'`, (c) `item.slug === 'checkout'`, (d) locale is not in supported set. Returns `true` if item should be excluded. Exclude any item without a valid slug.
- [x] T019 [US3] Integrate `shouldExclude()` filter into all 4 sub-sitemap routes: `server/routes/sitemap-pages.xml.ts`, `server/routes/sitemap-tours.xml.ts`, `server/routes/sitemap-blog.xml.ts`, `server/routes/sitemap-categories.xml.ts`
- [x] T020 [US3] Verify noindex exclusion: `curl /sitemap-tours.xml` and confirm tours with `robots: noindex` (verify via API response) are absent. Repeat for blog posts and pages.
- [x] T021 [P] [US3] Verify locale exclusion: `curl` all sitemaps and grep for `/ar/` — must return zero matches. Confirm only 7 supported locales appear in hreflang values: `fr`, `de`, `it`, `pt`, `es`, `zh` (and `x-default`).
- [x] T022 [P] [US3] Verify checkout exclusion: `curl /sitemap-pages.xml | grep -i "checkout"` — must return nothing. Confirm `/checkout` URL is absent from all sitemaps.

**Checkpoint**: All exclusion rules verified. Sitemaps are clean — only indexable content included.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation across all quality gates, error scenarios, and XML compliance

- [x] T023 [P] Run domain separation check (GATE-04): `curl` all 5 sitemap routes and grep for `sunpyramidtours.com` (backend domain) — must return zero matches. All `<loc>` and `<xhtml:link href="">` must use `https://sunpyramidstours.com`.
- [x] T024 [P] Run hreflang verification (GATE-06): `curl` sub-sitemaps and confirm (a) zero `hreflang="en"`, (b) `hreflang="x-default"` present on every `<url>` that has translations, (c) English x-default URL uses root path (no `/en` prefix), (d) maximum 7 hreflang entries per URL
- [x] T025 [P] Run XML schema validation (GATE-07): validate all 5 sitemap files against sitemaps.org XML schema using `xmllint --valid` or equivalent online validator. All files must pass.
- [x] T026 Run API failure resilience test (FR-011): temporarily block the API host or simulate a 500 response, `curl` each sub-sitemap and confirm (a) HTTP 200 OK, (b) valid but empty `<urlset>` returned, (c) no broken/truncated XML, (d) sitemap index still returns 4 `<sitemap>` entries with 200 OK
- [x] T027 Run API 30-second timeout verification: confirm that sub-sitemap routes implement a 30-second timeout per API call and return empty `<urlset>` (not hang indefinitely) if the API does not respond
- [x] T028 Verify already-correct pages unaffected: `curl` a few content pages (homepage, about-us, faqs) and confirm SEO tags still present. Confirm the sitemap feature did not break existing page rendering.
- [x] T029 Run full quickstart.md validation procedure (Steps 1-8) from `specs/004-sitemap-generation/quickstart.md` — all steps must pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — creates all 5 route files
- **User Story 2 (Phase 4)**: Depends on US1 completion (needs working routes to verify data pipeline)
- **User Story 3 (Phase 5)**: Depends on US1 completion (adds exclusion logic to existing routes)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — creates the 5 server route files + removes static file
- **US2 (P1)**: Depends on US1 (routes must exist to verify dynamic data) — verification-focused
- **US3 (P2)**: Depends on US1 (routes must exist before adding exclusion filters) — adds filters + verifies

### Within Each User Story

- US1: Create utility → Create routes in parallel → Delete static file → Verify
- US2: Verify tours → Verify blogs → Verify marketing pages → Cross-locale check
- US3: Create filter utility → Integrate into routes → Verify each exclusion rule

### Parallel Opportunities

- Phase 1: T001, T002 can run in parallel
- Phase 2: T003, T004, T005 can all run in parallel (different files/read-only)
- US1: T008, T009, T010, T011 can all run in parallel (different route files)
- US2: T014, T015, T016 can run in parallel (different content types)
- US3: T021, T022 can run in parallel (different grep checks)
- Phase 6: T023, T024, T025 can run in parallel (independent curl commands)

---

## Parallel Example: User Story 1 — Create All Routes Concurrently

```bash
# These route files have no dependencies on each other — create in parallel:
# Developer A:
Task: "T008 [US1] Create server/routes/sitemap-pages.xml.ts"

# Developer B:
Task: "T009 [US1] Create server/routes/sitemap-tours.xml.ts"

# Developer C:
Task: "T010 [US1] Create server/routes/sitemap-blog.xml.ts"

# Developer D:
Task: "T011 [US1] Create server/routes/sitemap-categories.xml.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (create all 5 routes, delete static file)
4. **STOP and VALIDATE**: `curl` all 5 routes — confirm valid XML
5. At this point: search engines receive a valid, structured sitemap. This is baseline MVP.

### Incremental Delivery

1. Setup + Foundational → Utilities and contracts ready
2. Add US1 (routes) → Test independently → Valid sitemap served (MVP!)
3. Add US2 (dynamic data verification) → Test independently → Confirmed live API sourcing
4. Add US3 (exclusion rules) → Test independently → Clean, indexable-only sitemap
5. Polish → Full quality gate validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Sitemap index route (T007) + pages route (T008)
   - Developer B: Tours route (T009) + blog route (T010)
   - Developer C: Categories route (T011) + shared utility (T006)
3. All converge: T012 (static file removal), then US2 verification, then US3 implementation, then Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test framework required — validation via curl + XML schema checks per quickstart.md
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- The sitemap index route (T007) requires no API calls — pure XML from route knowledge
- Shared utility in `server/utils/sitemap-helpers.ts` is the only new file outside `server/routes/`
- Exclusion filter function is created once (T018) and integrated identically into all 4 sub-sitemap routes (T019)
- `public/sitemap.xml` deletion (T012) is critical — keeping it may cause route conflicts in dev mode
- API response shape for each endpoint must match assumptions in sitemap-route-contract.md
