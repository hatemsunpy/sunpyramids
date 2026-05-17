# Tasks: Lighthouse Performance & SEO Validation

**Input**: Design documents from `specs/005-lighthouse-validation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/no-third-party-contract.md, quickstart.md

**Tests**: Not applicable — this is a manual validation phase, not a development phase.

**Organization**: Tasks grouped by user story for traceability, but all Lighthouse audits share the same runs (each run produces both SEO score and CWV).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different URLs, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup (Code Change for Diagnostic Mode)

**Purpose**: Implement the `?no-third-party=1` query parameter mechanism required for diagnostic comparison.

- [x] T001 Implement conditional GTM/GA4 suppression via `route.query['no-third-party']` in `app.vue`
- [ ] T002 Deploy the `app.vue` change to staging/production
- [ ] T003 Verify via curl: `curl 'https://sunpyramidstours.com/?no-third-party=1'` returns HTML without GTM/GA4 script references, with identical SEO tags and clean canonical

---

## Phase 2: Foundational (Prerequisites)

**Purpose**: Confirm environment readiness before starting audits.

**⚠️ CRITICAL**: No audits can begin until target environment is confirmed serving SEO data.

- [ ] T004 Confirm staging/production environment is running with specs 002-004 fixes deployed and backend API accessible
- [x] T005 Create report directory `docs/seo-validation/` if it does not exist

**Checkpoint**: Environment ready — audits can begin.

---

## Phase 3: User Story 1 — Measure SEO Score Improvement Across All Page Types (Priority: P1) 🎯 MVP

**Goal**: Run Lighthouse audits on 17 page-locale combinations and confirm SEO scores are 100 or improved ≥ +5 from baseline.

**Independent Test**: Lighthouse on English homepage returns SEO score = 100 or ≥ baseline + 5.

### Curl Pre-Checks

- [ ] T006 [US1] Curl English homepage and verify title, meta description, OG, Twitter, canonical, hreflang tags present in raw HTML at `https://sunpyramidstours.com/`
- [ ] T007 [US1] Curl-verify no `<meta name="keywords">` present, no backend domain (`sunpyramidtours.com`) in canonical/hreflang/og:url

### Homepage × 7 Locales

- [ ] T008 [US1] Run Lighthouse (mobile, simulated 4G) on `https://sunpyramidstours.com/` — record SEO score, compare to baseline
- [ ] T009 [P] [US1] Run Lighthouse on `/fr` homepage — record SEO score
- [ ] T010 [P] [US1] Run Lighthouse on `/de` homepage — record SEO score
- [ ] T011 [P] [US1] Run Lighthouse on `/it` homepage — record SEO score
- [ ] T012 [P] [US1] Run Lighthouse on `/pt` homepage — record SEO score
- [ ] T013 [P] [US1] Run Lighthouse on `/es` homepage — record SEO score
- [ ] T014 [P] [US1] Run Lighthouse on `/zh` homepage — record SEO score

### Tour Detail × 7 Locales

- [ ] T015 [US1] Select a published tour available in all 7 locales; run Lighthouse on `/tour/[slug]`
- [ ] T016 [P] [US1] Run Lighthouse on `/fr/tour/[slug]`
- [ ] T017 [P] [US1] Run Lighthouse on `/de/tour/[slug]`
- [ ] T018 [P] [US1] Run Lighthouse on `/it/tour/[slug]`
- [ ] T019 [P] [US1] Run Lighthouse on `/pt/tour/[slug]`
- [ ] T020 [P] [US1] Run Lighthouse on `/es/tour/[slug]`
- [ ] T021 [P] [US1] Run Lighthouse on `/zh/tour/[slug]`

### English Static Pages

- [ ] T022 [P] [US1] Run Lighthouse on `/about-us`
- [ ] T023 [P] [US1] Run Lighthouse on `/contact-us`
- [ ] T024 [P] [US1] Run Lighthouse on `/faqs`

### SEO Score Analysis

- [ ] T025 [US1] Compare all 17 SEO scores against baselines (or absolute thresholds if no baseline). Mark each as pass (+5 or =100), pass-with-caveat, or fail per FR-003/FR-015.

**Checkpoint**: All 17 page-locale combinations audited with SEO scores recorded and compared.

---

## Phase 4: User Story 2 — Core Web Vitals Regression Check (Priority: P1)

**Goal**: From the same Lighthouse runs, extract LCP, TBT, CLS and verify no regressions exceeding thresholds.

**Independent Test**: English homepage LCP ≤ 2.5s (mobile, simulated 4G), TBT not worsened from baseline by >50ms.

### CWV Extraction & Comparison

- [ ] T026 [US2] Extract LCP, TBT, CLS from all 17 Lighthouse runs and compare to baselines; mark any regression exceeding LCP >10% or TBT >50ms
- [ ] T027 [US2] Run Lighthouse on English homepage with Slow 4G throttling — record LCP and TBT
- [ ] T028 [US2] Run Lighthouse on English homepage with Desktop profile — compare SEO and CWV to mobile results
- [ ] T029 [US2] Verify sitemap sub-sitemap response times are within 30-second timeout (curl each sitemap route)

**Checkpoint**: Core Web Vitals validated — no regressions exceeding thresholds.

---

## Phase 5: User Story 3 — Prefetch & Crawlability Validation (Priority: P2)

**Goal**: Verify homepage loads exactly 1 text/html document (no prefetch) and all card links are real `<a href>` elements.

**Independent Test**: Chrome DevTools Network tab (Doc filter) shows 1 document; inspect card HTML confirms `<a href>`.

- [ ] T030 [US3] Open Chrome DevTools → Network tab → filter Doc/text-html; load homepage; confirm exactly 1 document request
- [ ] T031 [US3] Inspect tour cards, blog cards, destination cards on homepage; confirm all are `<a href="...">` anchor elements (no JS-only click handlers)

**Checkpoint**: Prefetch controlled and links crawlable — verified.

---

## Phase 6: User Story 4 — Cross-Browser & Mobile Audit (Priority: P2)

**Goal**: Confirm SEO tags are identical across Chrome and Safari user-agents.

**Independent Test**: `curl` homepage with Chrome UA and Safari UA, diff the `<title>` and `<meta>` tags.

- [ ] T032 [US4] Curl homepage with Chrome user-agent string, extract SEO tags
- [ ] T033 [US4] Curl homepage with Safari user-agent string, extract SEO tags
- [ ] T034 [US4] Diff Chrome vs Safari SEO tags — confirm identical title, description, canonical, hreflang, OG, Twitter tags

**Checkpoint**: Cross-browser SEO tag parity confirmed.

---

## Phase 7: Diagnostic Comparison — Third-Party Script Isolation

**Purpose**: Run `?no-third-party=1` diagnostic audits and apply the FR-015 decision matrix.

- [ ] T035 Run Lighthouse on `https://sunpyramidstours.com/?no-third-party=1` (mobile, simulated 4G) — record SEO score and CWV
- [ ] T036 Compare with-scripts vs without-scripts results per FR-015 matrix; classify impact as third-party or first-party

---

## Phase 8: Polish — Validation Report & GATE-12 Verdict

**Purpose**: Produce the structured Markdown report and final GATE-12 pass/fail verdict.

- [ ] T037 Fill the validation report template from quickstart.md with all 17 comparisons, diagnostic results, and cross-browser findings
- [ ] T038 Review all pass/fail/caveat counts; confirm 0 confirmed failures. Render GATE-12 verdict (PASS only if failedCount = 0).
- [ ] T039 Commit `docs/seo-validation/phase-5-lighthouse-validation-report.md` to the repository

**Checkpoint**: GATE-12 verdict rendered and report committed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — make the `app.vue` change and deploy immediately
- **Foundational (Phase 2)**: Depends on Setup (T002 deploy) — BLOCKS all audits
- **US1 (Phase 3)**: Depends on Foundational — all 17 SEO audits
- **US2 (Phase 4)**: Runs on same Lighthouse data as US1 — depends on US1 completion
- **US3 (Phase 5)**: Depends on Foundational — can run in parallel with US1
- **US4 (Phase 6)**: Depends on Foundational — can run in parallel with US1
- **Diagnostic (Phase 7)**: Depends on US1 + US2 completion (needs with-scripts baseline for comparison)
- **Polish (Phase 8)**: Depends on ALL prior phases complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependencies on other stories
- **US2 (P1)**: After US1 (reuses same Lighthouse data)
- **US3 (P2)**: After Foundational — independent of US1/US2
- **US4 (P2)**: After Foundational — independent of US1/US2/US3

### Within Each Phase

- T006 → T007 (curl pre-checks before Lighthouse)
- T008 → T009-T014 (English homepage first as canary, then parallel locales)
- T015 → T016-T021 (English tour first, then parallel locales)
- T022-T024 can all run in parallel
- T025 depends on all prior US1 runs

### Parallel Opportunities

- All homepage locales (T009-T014) can run in parallel
- All tour detail locales (T016-T021) can run in parallel
- All static pages (T022-T024) can run in parallel
- US3 (T030-T031) can run in parallel with US1 audits
- US4 (T032-T034) can run in parallel with US1 audits

---

## Parallel Example: Homepage Locale Audits

```bash
# After English homepage passes (T008), run all 6 remaining locales in parallel:
Task: "Run Lighthouse on /fr homepage"
Task: "Run Lighthouse on /de homepage"
Task: "Run Lighthouse on /it homepage"
Task: "Run Lighthouse on /pt homepage"
Task: "Run Lighthouse on /es homepage"
Task: "Run Lighthouse on /zh homepage"
```

---

## Implementation Strategy

### MVP First (US1 Only — English Homepage)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Run T006-T008: curl pre-check + English homepage Lighthouse
4. **STOP**: If English homepage SEO score passes, proceed. If not, fix before auditing 16 more pages.

### Sequential Execution (Single Developer)

Since this is a manual one-time gate by one developer:

1. Code change (T001-T003) — 15 min
2. Prerequisites (T004-T005) — 5 min
3. English homepage + curl (T006-T008) — 10 min
4. Remaining homepage locales (T009-T014) — 30 min
5. Tour detail locales (T015-T021) — 35 min
6. Static pages (T022-T024) — 15 min
7. Analysis (T025-T029) — 15 min
8. Prefetch + crawlability (T030-T031) — 10 min
9. Cross-browser (T032-T034) — 5 min
10. Diagnostic comparison (T035-T036) — 10 min
11. Report + verdict (T037-T039) — 15 min

**Estimated total**: ~2.5 hours

---

## Notes

- All Lighthouse audits are manual via Chrome DevTools Lighthouse tab
- Each audit records: URL, locale, SEO score, Performance score, LCP, TBT, CLS, device profile, throttling, third-party mode
- If a page fails, rerun once before marking as a confirmed failure
- Use absolute thresholds (SEO=100, LCP<2.5s) when baseline is missing
- The `?no-third-party=1` diagnostic run does NOT override the official GATE-12 verdict
- Report path: `docs/seo-validation/phase-5-lighthouse-validation-report.md`
