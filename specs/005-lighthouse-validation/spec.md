# Feature Specification: Lighthouse Performance & SEO Validation

**Feature Branch**: `005-lighthouse-validation`
**Created**: 2026-05-12
**Status**: Draft
**Input**: User description: "Lighthouse validation"

## Clarifications

### Session 2026-05-12

- Q: What constitutes "measurably improved from baseline" for Lighthouse SEO scores? → A: Minimum +5 points above baseline OR score = 100. +1 to +4 improvement without reaching 100 is a fail. Suspected transient variance triggers a rerun; use the stable repeated result.
- Q: What format should the ValidationReport use and where should it be stored? → A: Markdown file committed to the repo at `docs/seo-validation/phase-5-lighthouse-validation-report.md`. JSON and HTML dashboard are out of scope for this phase.
- Q: How should third-party script impact be isolated? → A: `?no-third-party=1` query param suppresses third-party script injection (GTM, GA4, Clarity, chat widgets, pixels) without changing content, SEO tags, or first-party functionality. Official GATE-12 verdict uses the normal URL; diagnostic run uses the param for isolation.
- Q: What is the exact page-locale audit matrix? → A: Homepage × 7 locales + 1 tour detail × 7 locales + 3 English static pages (about-us, contact-us, faqs) = 17 page-locale combinations.
- Q: How many failures are tolerated before blocking GATE-12? → A: Zero tolerance. Any confirmed repeated failure on any page-locale combination blocks GATE-12. Transient failures may be rerun once; if rerun passes, mark as passed with note; if rerun fails, remediation required.
- Q: Should Phase 5 be automated in CI or performed manually? → A: Manual one-time pre-release quality gate. A developer manually runs Lighthouse audits and produces the structured report. CI automation is out of scope for this phase; it may be considered as a separate follow-up.
- Q: Should Lighthouse accessibility scores affect GATE-12? → A: No. Phase 5 pass/fail depends only on SEO score, Core Web Vitals, and technical SEO validations. Accessibility scores may be noted as informational only but do not block the gate.
- Q: What is the third-party script diagnostic decision matrix? → A: (a) Both runs pass → page passes. (b) With-scripts fails, without-scripts passes → document third-party impact, identify responsible script, page may pass with noted third-party caveat. (c) Both runs fail → first-party/code-level issue, must be fixed. (d) With-scripts passes, without-scripts fails → unlikely but treat as code issue.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Measure SEO Score Improvement Across All Page Types (Priority: P1)
After implementing SEO rendering fixes (Phases 1-4), the team needs to run Lighthouse audits on every critical page type across all supported locales to confirm that SEO scores have improved from the pre-fix baseline. The audit must cover the homepage, tour detail pages, blog posts, category listings, and static pages (about-us, contact-us, faqs) — for each of the 7 supported locales.

**Why this priority**: Lighthouse SEO score is the primary quantitative measure of whether the SEO fixes worked. Without this validation, we cannot confirm the fixes actually improved crawlability. GATE-12 and AC-23 both require this.

**Independent Test**: Run Lighthouse on the homepage for English. If the SEO score is 100 (or improved from baseline), move to other pages. Each page type is independently auditable.

**Acceptance Scenarios**:
1. **Given** the SEO fixes from specs 002, 003, and 004 are deployed, **When** Lighthouse is run against the English homepage, **Then** the SEO score is 100 or measurably improved from the pre-fix baseline score.
2. **Given** a tour detail page (e.g., `/tour/giza-pyramids`), **When** Lighthouse is run, **Then** the SEO score is 100 with all SEO tags present in the raw HTML.
3. **Given** a blog post page, **When** Lighthouse is run, **Then** the SEO score reflects proper meta description, canonical, and hreflang presence.
4. **Given** a translated page (e.g., `/fr` homepage), **When** Lighthouse is run, **Then** the SEO score accounts for hreflang alternates and locale-specific metadata.

### User Story 2 - Core Web Vitals Regression Check (Priority: P1)
The SEO fixes involved SSR changes that could affect page load performance. Core Web Vitals — LCP, TBT, and CLS — must be measured on key pages and compared against pre-fix baselines.

**Why this priority**: A performance regression that damages user experience is an unacceptable trade-off. SEO improvement must not come at the cost of Core Web Vitals. This directly fulfills the second half of GATE-12.

**Independent Test**: Run Lighthouse on the English homepage and compare LCP and TBT to pre-fix baselines.

**Acceptance Scenarios**:
1. **Given** the homepage is audited with Lighthouse (mobile profile), **When** the report is generated, **Then** LCP remains under 2.5 seconds and does not increase from baseline by more than 10%.
2. **Given** the homepage is audited, **When** the report is generated, **Then** TBT does not worsen from baseline by more than 50ms.
3. **Given** a tour detail page is audited, **When** the report is generated, **Then** CLS remains under 0.1 (good threshold).
4. **Given** the sitemap routes, **When** response time is measured, **Then** each sub-sitemap completes within the 30-second timeout.

### User Story 3 - Prefetch & Crawlability Validation (Priority: P2)
The prefetch disable fix (from 003-page-ssr-seo-fixes) must be validated end-to-end: homepage must not automatically fetch internal HTML documents, while all navigation links remain crawlable `<a href>` anchor elements.

**Why this priority**: Prefetch was a major performance drain (dozens of unnecessary HTML requests, some taking 10+ seconds). AC-25 and AC-26 require this check.

**Independent Test**: Open Chrome DevTools Network tab with Doc filter — confirm only main document loads. Inspect card HTML — confirm real `<a href>` elements.

**Acceptance Scenarios**:
1. **Given** the homepage loaded with cache disabled, **When** Network tab is filtered to Doc/text-html, **Then** only the main homepage document is fetched.
2. **Given** a tour card on the homepage, **When** its HTML is inspected, **Then** the link is a real `<a href="/tour/...">` element.
3. **Given** a user clicks a tour card link, **When** navigation occurs, **Then** the tour page loads correctly.
4. **Given** a crawler parses the homepage HTML, **When** it extracts links, **Then** all internal navigation links are discoverable as standard anchor elements.

### User Story 4 - Cross-Browser & Mobile Audit (Priority: P2)
SEO tags and page performance must be consistent across major browsers (Chrome, Firefox, Safari) and device profiles (mobile and desktop).

**Why this priority**: Crawlers and users access the site from diverse clients. Lower priority because SSR typically produces identical HTML for all clients.

**Independent Test**: `curl` the homepage with Chrome and Safari user-agent strings, diff the SEO tag sections.

**Acceptance Scenarios**:
1. **Given** homepage requested with Chrome user-agent, **When** compared to Safari user-agent request, **Then** SEO tags are identical.
2. **Given** Lighthouse mobile audit, **When** compared to desktop audit, **Then** SEO scores match.

### Edge Cases
- 500 error during audit: mark as transient failure, retry once, distinguish "SEO failure" from "availability failure". Confirmed repeated failure blocks GATE-12.
- Third-party scripts delaying load: Apply FR-015 diagnostic matrix. Official audit uses normal URL with third-party scripts enabled; diagnostic comparison uses `?no-third-party=1`. If with-scripts fails but without passes, document the responsible third-party script and note the caveat. If both fail, fix as first-party regression.
- Network conditions vary: At minimum one "Slow 4G" throttling audit
- `ssr: false` pages like `/checkout` excluded from scope
- Missing pre-fix baseline: Use absolute thresholds (SEO=100, LCP<2.5s)
- Transient score variance (+1 to +4 improvement, no 100): Rerun the audit; use the stable repeated result for pass/fail determination

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Run Lighthouse audits against ALL critical page types (homepage, tour detail, blog post, tour category listing, blog category listing, 3 static pages)
- **FR-002**: Audit matrix (17 combinations total): Homepage × 7 locales (`/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`) + 1 tour detail × 7 locales (`/tour/[slug]` per locale) + 3 English static pages (`/about-us`, `/contact-us`, `/faqs`). Selected tour must be published, indexable, and available in all tested locales; fall back to another tour if missing in a locale.
- **FR-003**: Lighthouse SEO score must meet either: (a) absolute score = 100, or (b) improvement ≥ +5 points above recorded baseline. Improvement of +1 to +4 without reaching 100 is a fail. Zero pages lower than baseline. Suspected transient variance triggers a rerun; use the stable repeated result.
- **FR-004**: Core Web Vitals measured and compared against baselines. No page regress in LCP by >10% or TBT by >50ms.
- **FR-005**: Homepage Doc/text-html filter shows exactly 1 document (no prefetch)
- **FR-006**: Every card/listing link verified as crawlable `<a href="...">` — zero JS-only click handlers
- **FR-007**: Raw HTML of English homepage curl-verified before each Lighthouse run
- **FR-008**: Structured validation report as Markdown file at `docs/seo-validation/phase-5-lighthouse-validation-report.md`: page URL, locale, SEO score, LCP, TBT, CLS, baseline comparison, pass/fail status, third-party script status, transient failure/rerun notes, and final GATE-12 verdict
- **FR-009**: Both mobile and desktop profiles for at minimum English homepage
- **FR-010**: At minimum one homepage audit under Slow 4G throttling
- **FR-011**: `?no-third-party=1` query parameter must suppress all third-party scripts (GTM, GA4, Clarity, chat widgets, pixels) without altering page content, SEO tags, canonical, hreflang, schema, or internal links. Canonical must remain the clean URL. Do not inject noindex. Do not include `?no-third-party` URLs in sitemaps or internal navigation.
- **FR-012**: GATE-12 verdict rule — zero tolerance for confirmed failures. Any page-locale combination that fails on two consecutive runs blocks GATE-12. Transient one-time failures may be rerun; if rerun passes, mark as passed with a note documenting the transient issue. Homepage failure always blocks. No page may regress below baseline or lose required SEO tags.
- **FR-013**: Phase 5 is a manual one-time pre-release quality gate executed by a developer. CI automation is out of scope. Lighthouse audits are run manually; the developer produces the structured validation report.
- **FR-014**: GATE-12 depends only on SEO score, Core Web Vitals, and technical SEO validations (canonical, hreflang, schema, OG/Twitter tags, sitemap eligibility, crawlability). Lighthouse accessibility score is explicitly excluded from pass/fail criteria; it may be recorded as informational only.
- **FR-015**: Third-party script diagnostic matrix per audited page: (a) with-scripts pass + without-scripts pass → pass; (b) with-scripts fail + without-scripts pass → document third-party impact and identify responsible script, page may pass with noted caveat; (c) both fail → first-party/code issue, must fix; (d) with-scripts pass + without-scripts fail → treat as code issue.

### Key Entities
- **LighthouseAudit**: Single run with target URL, locale, device profile, SEO score, Core Web Vitals, raw flag results
- **AuditComparison**: Current results paired with baseline for same page URL
- **ValidationReport**: Markdown file at `docs/seo-validation/phase-5-lighthouse-validation-report.md` containing: audit date, tested environment, tested URLs/locales, baseline vs after-fix scores with deltas, Core Web Vitals, third-party script status, per-page pass/fail, screenshots/links, transient failure/rerun notes, and final GATE-12 verdict.
- **PrefetchAudit**: Homepage network waterfall check with Doc/text-html count and crawlable-link verification

## Success Criteria *(mandatory)*
- **SC-001**: 100% of audited pages achieve Lighthouse SEO score of 100 OR improvement ≥ +5 points above baseline. Pages with only +1 to +4 improvement that have not reached 100 are counted as failures.
- **SC-002**: English homepage LCP ≤ 2.5 seconds on mobile profile with simulated throttling
- **SC-003**: Zero pages show TBT regression >50ms from baseline
- **SC-004**: Homepage Doc/text-html request count = 1 (down from dozens pre-fix)
- **SC-005**: 100% of card/listing links verified as real `<a href>` anchor elements
- **SC-006**: `curl` confirms all required SEO tags in raw initial HTML before any Lighthouse run
- **SC-007**: Complete validation report covering all 17 page-locale combinations (7 homepages + 7 tour details + 3 static pages) with pass/fail per entry
- **SC-008**: SEO scores and tag presence identical across Chrome and Safari user-agent requests

## Out of Scope
- Lighthouse CI automation / automated regression monitoring
- Lighthouse accessibility score as pass/fail criteria (may be informational only)
- HTML dashboard or JSON report output
- `ssr: false` pages like `/checkout`
- Ongoing monitoring beyond the one-time pre-release gate

## Assumptions
- Specs 002, 003, 004 implementations complete and deployed
- Pre-fix baseline exists or absolute thresholds used
- Audits run against staging/production with backend API accessible
- 30-second API timeout implemented
- Third-party scripts present; their impact isolated via `?no-third-party=1` diagnostic comparison and noted separately in report
