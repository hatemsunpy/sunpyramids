# Feature Specification: Lighthouse Performance & SEO Validation

**Feature Branch**: `005-lighthouse-validation`
**Created**: 2026-05-12
**Status**: Draft
**Input**: User description: "Lighthouse validation"

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
- 500 error during audit: mark as failed, retry, distinguish "SEO failure" from "availability failure"
- Third-party scripts delaying load: Run with and without third-party scripts
- Network conditions vary: At minimum one "Slow 4G" throttling audit
- `ssr: false` pages like `/checkout` excluded from scope
- Missing pre-fix baseline: Use absolute thresholds (SEO=100, LCP<2.5s)

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Run Lighthouse audits against ALL critical page types (homepage, tour detail, blog post, tour category listing, blog category listing, 3 static pages)
- **FR-002**: Audits for ALL 7 supported locales on homepage + one additional page type per locale
- **FR-003**: Lighthouse SEO score = 100 or measurably improved from baseline for every page. Zero pages lower than baseline.
- **FR-004**: Core Web Vitals measured and compared against baselines. No page regress in LCP by >10% or TBT by >50ms.
- **FR-005**: Homepage Doc/text-html filter shows exactly 1 document (no prefetch)
- **FR-006**: Every card/listing link verified as crawlable `<a href="...">` — zero JS-only click handlers
- **FR-007**: Raw HTML of English homepage curl-verified before each Lighthouse run
- **FR-008**: Structured validation report: page URL, locale, SEO score, LCP, TBT, CLS, baseline comparison, pass/fail status
- **FR-009**: Both mobile and desktop profiles for at minimum English homepage
- **FR-010**: At minimum one homepage audit under Slow 4G throttling

### Key Entities
- **LighthouseAudit**: Single run with target URL, locale, device profile, SEO score, Core Web Vitals, raw flag results
- **AuditComparison**: Current results paired with baseline for same page URL
- **ValidationReport**: Aggregate output with all AuditComparisons, statistics, pass/fail recommendation
- **PrefetchAudit**: Homepage network waterfall check with Doc/text-html count and crawlable-link verification

## Success Criteria *(mandatory)*
- **SC-001**: 100% of audited pages achieve Lighthouse SEO score of 100 OR measurable improvement from baseline
- **SC-002**: English homepage LCP ≤ 2.5 seconds on mobile profile with simulated throttling
- **SC-003**: Zero pages show TBT regression >50ms from baseline
- **SC-004**: Homepage Doc/text-html request count = 1 (down from dozens pre-fix)
- **SC-005**: 100% of card/listing links verified as real `<a href>` anchor elements
- **SC-006**: `curl` confirms all required SEO tags in raw initial HTML before any Lighthouse run
- **SC-007**: Complete validation report covering ≥20 page-locale combinations with pass/fail
- **SC-008**: SEO scores and tag presence identical across Chrome and Safari user-agent requests

## Assumptions
- Specs 002, 003, 004 implementations complete and deployed
- Pre-fix baseline exists or absolute thresholds used
- Audits run against staging/production with backend API accessible
- 30-second API timeout implemented
- Third-party scripts present; their impact noted separately
