# Tasks: SEO Foundational Fixes

**Input**: Design documents from `/specs/002-seo-foundational-fixes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in specification. Validation via curl-based smoke tests per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Nuxt 3 project**: `composables/`, `utils/`, `pages/` at repository root
- All paths relative to `D:\Sun Pyramids\sun pyramids tours - Web\sun-front\`

---

## Phase 1: Setup (Development Environment)

**Purpose**: Ensure dev server runs and prerequisites are met

- [x] T001 Verify dev server starts with `npm run dev` and serves pages at `http://localhost:3000/`
- [x] T002 [P] Confirm all 7 supported locales are accessible: `/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`

---

## Phase 2: Foundational (Codebase Understanding)

**Purpose**: Understand current implementations before making changes

**⚠️ CRITICAL**: No modifications until each file is reviewed against spec requirements

- [x] T003 Review `generateHreflangLinks()` in `utils/seo.js` — confirm the current locale loop at lines 33-40 does NOT yet skip `"en"`, and identify the exact insertion point for the `continue` statement
- [x] T004 [P] Review `addSeo()` in `composables/useSeo.js` — map current OG/Twitter attribute usage (META_NAME_TAGS at lines 11-18, META_PROPERTY_TAGS at lines 20-25), fallback chains (lines 84-100), and schema integration (lines 103-112)
- [x] T005 [P] Review `useApi()` in `composables/useApi.js` — verify `X-Localize` header uses `useI18n().locale` at lines 2,10 (server-safe, not `navigator`)

**Checkpoint**: Foundation ready — all three files understood, gaps identified against spec requirements

---

## Phase 3: User Story 1 - Search Engines Receive Clean Hreflang Annotations (Priority: P1) 🎯 MVP

**Goal**: Remove `hreflang="en"` link tags; English is represented exclusively by `hreflang="x-default"`

**Independent Test**: `curl http://localhost:3000/ | grep "hreflang"` — must show `hreflang="x-default"` and zero `hreflang="en"` entries

### Implementation for User Story 1

- [x] T006 [US1] Add `if (loc === "en") continue;` at the top of the locale loop in `generateHreflangLinks()` in `utils/seo.js` (inside the `for (const loc of availableLocales)` block, before `links.push()`) per research.md decision #1
- [x] T007 [US1] Verify `x-default` hreflang tag is still generated (line 26-30) and points to root URL without `/en` prefix in `utils/seo.js`

**Checkpoint**: `curl http://localhost:3000/ | grep "hreflang"` shows only `x-default` and non-English locales — zero `hreflang="en"`

---

## Phase 4: User Story 2 - Social Media Platforms Receive Valid OG Metadata (Priority: P1)

**Goal**: All OG tags use `property=""`, all Twitter tags use `name=""`, and Twitter fallback chain is complete

**Independent Test**: `curl http://localhost:3000/ | grep "og:" | grep 'name="og:"'` returns nothing; `curl http://localhost:3000/ | grep "twitter:" | grep 'property="twitter:"'` returns nothing

### Implementation for User Story 2

- [x] T008 [US2] Verify OG tags in `composables/useSeo.js` correctly use `property` attribute: confirm `META_PROPERTY_TAGS` entries (lines 20-25) are pushed via `{ property: tagName, content: ... }` at line 79, and hardcoded OG entries (lines 60-62) also use `property`
- [x] T009 [US2] Verify Twitter tags in `composables/useSeo.js` correctly use `name` attribute: confirm `META_NAME_TAGS` twitter entries (lines 13-17) are pushed via `{ name: tagName, content: ... }` at line 73
- [x] T010 [US2] Extend Twitter fallback chain in `composables/useSeo.js` (lines 84-91): add second-level fallback from `og_*` to `meta_*` fields — when `twitter_title` is missing AND `og_title` is missing, fall back to `meta_title`; same for `twitter_description` → `og_description` → `meta_description` per FR-006 and data-model.md fallback chain
- [x] T011 [US2] Verify OG fallback chain in `composables/useSeo.js` (lines 95-100): `og_title` → `meta_title` and `og_description` → `meta_description` are correctly implemented

**Checkpoint**: OG tags have `property`, Twitter tags have `name`, fallback chains match data-model.md specifications

---

## Phase 5: User Story 3 - No Internal SEO Artifacts Leak to Public Pages (Priority: P1)

**Goal**: No `<meta name="keywords">` tag renders under any circumstance

**Independent Test**: `curl http://localhost:3000/ | grep -i "keywords"` returns zero matches

### Implementation for User Story 3

- [x] T012 [US3] Confirm `meta_keywords` is NOT present in `META_NAME_TAGS` object in `composables/useSeo.js` (lines 11-18) per research.md decision #3
- [x] T013 [US3] Verify `meta_keywords` is NOT rendered via any other code path: check that no `{ name: "keywords", content: ... }` meta is pushed anywhere in `composables/useSeo.js` per FR-005

**Checkpoint**: `curl http://localhost:3000/ | grep -i "keywords"` returns empty

---

## Phase 6: User Story 4 - Schema Markup Renders Safely Without Breaking Pages (Priority: P2)

**Goal**: Valid JSON-LD schemas render correctly; malformed schemas skip gracefully without crashing the page

**Independent Test**: `curl` page with valid `structure_schema` → `<script type="application/ld+json">` present; page with malformed schema → 200 OK, no broken JSON

### Implementation for User Story 4

- [x] T014 [US4] Verify `validateAndParseSchema()` in `utils/seo.js` (lines 45-85) correctly handles all input formats: pre-parsed object (line 53-58), raw JSON string with try/catch (lines 61-82), arrays (lines 55, 67-68), null/undefined (line 46-48) per data-model.md SchemaBlock lifecycle
- [x] T015 [US4] Verify schema integration in `composables/useSeo.js` (lines 103-112): confirm the result from `validateAndParseSchema()` is properly iterated and pushed as `seo.script` entries with `type: "application/ld+json"` per FR-007 and FR-008
- [x] T016 [US4] Add handling for empty string `structure_schema`: confirm `validateAndParseSchema()` returns `null` when `structure_schema` is `""` (empty string edge case from spec.md Edge Cases) in `utils/seo.js`

**Checkpoint**: Valid schema renders JSON-LD script tag; invalid/malformed/empty schema silently skipped with 200 status

---

## Phase 7: User Story 5 - API Requests During SSR Include Correct Localization (Priority: P2)

**Goal**: SSR API requests include correct `X-Localize` header for each locale

**Independent Test**: Monitor SSR API requests and verify `X-Localize` matches URL path locale (e.g., `/fr/tour/1` → `X-Localize: fr`)

### Implementation for User Story 5

- [x] T017 [US5] Verify `X-Localize` header is set from `useI18n().locale` in `composables/useApi.js` (line 10: `"X-Localize": locale.value`) — this resolves from URL path during SSR, not from `navigator` per FR-009 and FR-010
- [x] T018 [US5] Verify root path (`/`) resolves to `"en"` for `X-Localize` header: confirm `useI18n().locale.value` returns `"en"` when rendering the root URL during SSR per contracts/seo-utility-contract.md locale resolution table
- [x] T019 [US5] Confirm the `options` object in `composables/useApi.js` (lines 7-11) is re-evaluated per-request during SSR — Nuxt creates a new composable instance per SSR request, so `locale.value` reflects the current request's locale

**Checkpoint**: `curl http://localhost:3000/fr` returns French SEO data; `curl http://localhost:3000/` returns English SEO data

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation across all locales and quality gates

- [x] T020 Run hreflang verification (GATE-06): `curl http://localhost:3000/ | grep "hreflang"` — zero `hreflang="en"`, x-default present per SC-001
- [x] T021 [P] Run OG attribute verification (GATE-02): `curl http://localhost:3000/ | grep "og:" | grep 'name="og:"'` — must return nothing per SC-002
- [x] T022 [P] Run Twitter attribute verification: `curl http://localhost:3000/ | grep "twitter:" | grep 'property="twitter:"'` — must return nothing per FR-004
- [x] T023 [P] Run meta keywords verification (GATE-03): `curl http://localhost:3000/ | grep -i "keywords"` — must return nothing per SC-003
- [x] T024 Run schema safety verification (GATE-05): `curl http://localhost:3000/ | grep 'application/ld+json'` — confirm valid JSON-LD script tag present per SC-004
- [x] T025 Run cross-locale verification: loop over all 7 locales (`/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`) and verify each returns locale-specific `<title>` per SC-005
- [x] T026 Run API domain check (GATE-04): `curl http://localhost:3000/ | grep "sunpyramidtours.com"` — confirm no API domain (`sunpyramidtours.com`) in hreflang/canonical/og:url hrefs
- [x] T027 Run full quickstart.md validation procedure from `specs/002-seo-foundational-fixes/quickstart.md` lines 74-133

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — modifies `utils/seo.js`
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — modifies `composables/useSeo.js`
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) — modifies `composables/useSeo.js`
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) — modifies `utils/seo.js` and `composables/useSeo.js`
- **User Story 5 (Phase 7)**: Depends on Foundational (Phase 2) — modifies `composables/useApi.js`
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — only touches `utils/seo.js`
- **US2 (P1)**: Independent of US1 — only touches `composables/useSeo.js`
- **US3 (P1)**: Shares file with US2 (`composables/useSeo.js`) — execute sequentially after US2 to avoid merge conflicts
- **US4 (P2)**: Touches both `utils/seo.js` and `composables/useSeo.js` — execute after US1 and US3
- **US5 (P2)**: Independent — only touches `composables/useApi.js`; can run in parallel with any other phase

### Within Each User Story

- Review/understand current code → Apply fix → Verify fix
- Each story independently testable via its checkpoint curl command

### Parallel Opportunities

- Phase 2: T004 and T005 can run in parallel (different files)
- Phase 8: T021, T022, T023 can run in parallel (independent curl commands)
- US1 and US5 touch different files and can be worked on in parallel by different developers
- US2, US3, US4 all touch `composables/useSeo.js` — must be sequential to avoid conflicts

---

## Parallel Example: User Story 2 + User Story 5

```bash
# These can run in parallel (different files):
# Developer A: User Story 2 — OG/Twitter fixes in composables/useSeo.js
Task: "T008 [US2] Verify OG tags use property attribute in composables/useSeo.js"
Task: "T009 [US2] Verify Twitter tags use name attribute in composables/useSeo.js"
Task: "T010 [US2] Extend Twitter fallback chain in composables/useSeo.js"

# Developer B: User Story 5 — X-Localize verification in composables/useApi.js
Task: "T017 [US5] Verify X-Localize from useI18n().locale in composables/useApi.js"
Task: "T018 [US5] Verify root path resolves to 'en' in composables/useApi.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (hreflang fix)
4. **STOP and VALIDATE**: `curl http://localhost:3000/ | grep "hreflang"` — confirm no `hreflang="en"`
5. This alone fixes the highest-impact SEO issue at the utility layer

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (hreflang) → Test independently → Clean hreflang tags (MVP!)
3. Add US2 (OG/Twitter) → Test independently → Valid social sharing previews
4. Add US3 (meta keywords) → Test independently → No internal SEO leaks
5. Add US4 (schema safety) → Test independently → Safe structured data rendering
6. Add US5 (X-Localize) → Test independently → Correct multilingual API requests
7. Polish → Full cross-locale validation → Ready for page-template phases

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1, 2, 3, 4 sequentially (shared files: utils/seo.js, composables/useSeo.js)
   - Developer B: User Story 5 (independent file: composables/useApi.js)
3. Both developers converge on Polish phase for cross-validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test framework required — validation via curl-based smoke tests per quickstart.md
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Use FAQ page (`/faqs`) or blog listing (`/blogs/all-blogs`) as test targets — they already have correct SSR blocking and will reflect utility-layer changes (per quickstart.md line 143)
- Homepage SEO may not fully verify until Phase 3 (page-level SSR blocking) per quickstart.md line 138
