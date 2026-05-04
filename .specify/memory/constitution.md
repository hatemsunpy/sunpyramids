<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0 (initial ratification)
  PATCH: Principle V wording tightened ("should" → "MUST") for consistency
  Added sections:
    - Core Principles (5 principles)
    - Technical Constraints
    - Quality Gates
    - Governance
  Removed sections: none (template placeholders replaced)
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ aligned (Constitution Check gate compatible)
    - .specify/templates/spec-template.md ✅ aligned (functional requirements + success criteria compatible)
    - .specify/templates/tasks-template.md ✅ aligned (phase structure compatible)
  Follow-up TODOs: none
-->

# Sun Pyramids Tours — SEO Fix Constitution

**Source Plan**: `docs/superpowers/specs/2026-04-30-sun-pyramids-seo-fix-design.md`
**Scope**: SEO rendering fix across Nuxt 3.15 SSR frontend — composables, page templates, prerendering, sitemap, hreflang, schema, and route prefetch performance.

## Core Principles

### I. Server-Rendered SEO First

All SEO metadata (title, description, OG tags, Twitter cards, canonical, hreflang,
schema) MUST render in the raw initial HTML response without JavaScript execution.
SSR is non-negotiable for SEO-critical routes. Every page template MUST fetch and
render its dashboard-managed SEO data via `useAsyncData`/`useFetch` during SSR.

**Rationale**: Crawlers and social bots parse initial HTML. JS-dependent SEO tags
are invisible to most crawlers and fail Open Graph / Twitter Card validators.

### II. Dashboard-Driven, Never Hardcoded

Every SEO value MUST trace back to the Laravel dashboard or live content data.
No static `<title>`, `<meta>`, or `<link>` tags hardcoded in `.vue` components
for SEO-critical fields. Fallback chains are allowed only when the dashboard
field is genuinely empty, and must degrade gracefully (e.g., page.title →
"Sun Pyramids Tours").

**Rationale**: Hardcoded SEO drifts out of sync with dashboard-managed content,
duplicates values, and breaks multilingual parity. The dashboard is the single
source of truth.

### III. Multilingual Parity

All 7 supported locales (en, fr, de, it, pt, es, zh) MUST render locale-specific
SEO from the dashboard. Hreflang tags MUST be generated dynamically from actually
available translations — never hardcoded. Unsupported locales (e.g., Arabic /ar)
MUST be excluded from hreflang, sitemap, and language switcher. x-default
hreflang MUST point to English.

**Rationale**: Incorrect hreflang causes duplicate content penalties and confuses
search engines about language targeting.

### IV. Crawlable Links, Never Hidden

All internal navigation links MUST remain real `<a href="">` anchor elements in
the rendered HTML. Navigation MUST work on click without JavaScript. Links MUST
NOT be converted to JS-only click handlers, lazy-rendered in a way that hides
them from crawlers, or removed under any performance optimization.

**Rationale**: Search engines discover pages through crawlable `<a href>` links.
Removing or hiding links damages crawl coverage, sitemap completeness, and
internal PageRank flow.

### V. Performance Without Sacrificing Crawlability

Homepage performance optimizations MUST NOT damage SEO crawlability. Specific
rules for route prefetching:

- NuxtLink `prefetch` MUST be disabled (`no-prefetch` or `:prefetch="false"`)
  on repeated heavy card/listing links (tour cards, blog cards, destination
  cards, category cards, marketing cards)
- Links MUST remain crawlable `<a href>` elements
- Only the main homepage document MUST load on initial page load; internal
  route documents MUST load only on user click or for a small approved set of
  critical navigation links
- Global prefetch disable (nuxt.config `experimental.defaults.nuxtLink.prefetch`)
  is acceptable ONLY if component-level fixes are insufficient and important
  navigation UX is confirmed unaffected

**Rationale**: Nuxt's default prefetch behavior fetches every linked route's
HTML on page load, causing dozens of wasted text/html requests (some 5-10s+)
that block bandwidth and degrade LCP/TBT without any user benefit.

## Technical Constraints

- **Stack**: Nuxt 3.15 (SSR enabled) + Laravel API backend
- **Frontend domain** (canonical, hreflang, sitemap, og:url): `https://sunpyramidstours.com`
- **Backend domain** (API/dashboard only): `https://sunpyramidtours.com`
- **Backend domain MUST NOT** appear in canonical, hreflang, og:url, or sitemap URLs
- **Backend domain MUST** remain in use for all API/dashboard requests
- **Prerendering**: Enabled for critical routes (/, /fr, /de, /about-us, /contact-us, etc.)
- **Route `/checkout`**: `ssr: false` (intentional, preserved)
- **Meta keywords**: Dashboard field preserved but NEVER rendered in public HTML
- **Arabic (/ar)**: NOT in i18n config, excluded from all SEO output
- **Trailing-slash redirects**: NOT in scope, do not add
- **Fonts**: External `.woff2` with `font-display: swap` — no changes needed

## Quality Gates

All gates MUST pass before merge and before production deploy:

- [ ] **GATE-01 (curl)**: `curl <url>` returns `<title>`, `<meta name="description">`, OG tags, Twitter tags, canonical, hreflang in raw HTML
- [ ] **GATE-02 (OG attributes)**: All OG tags use `property=""` (not `name`)
- [ ] **GATE-03 (Keywords absent)**: `<meta name="keywords">` NOT present in any page source
- [ ] **GATE-04 (Domain separation)**: Backend domain absent from canonical/hreflang/og:url/sitemap
- [ ] **GATE-05 (Schema valid)**: Valid `structure_schema` renders as `application/ld+json`; invalid schema silently skipped
- [ ] **GATE-06 (Hreflang dynamic)**: Hreflang tags match available translations only, x-default=en
- [ ] **GATE-07 (Sitemap valid)**: `GET /sitemap.xml` returns valid XML, frontend domain, indexable pages only
- [ ] **GATE-08 (No hardcoding)**: Zero hardcoded SEO values in any `.vue` component
- [ ] **GATE-09 (No duplicates)**: Single canonical, single robots, single description per page
- [ ] **GATE-10 (Prefetch controlled)**: Homepage Doc filter shows only the main document on initial load; no internal route docs auto-fetched
- [ ] **GATE-11 (Links crawlable)**: All card links are real `<a href>` elements in rendered HTML
- [ ] **GATE-12 (Lighthouse)**: SEO score improves from baseline; LCP/TBT do not worsen

## Governance

This constitution supersedes all other practices for this feature. Any violation
of a Core Principle MUST be documented in the plan's Complexity Tracking table
with justification and explanation of why the simpler compliant approach was
rejected.

**Amendment process**:
1. Proposed change documented with rationale
2. Impact assessed against all 5 Core Principles and 12 Quality Gates
3. Constitution version bumped per semantic versioning (MAJOR: principle
   removal/redefinition, MINOR: new principle/section, PATCH: wording/clarification)
4. All dependent templates re-aligned before merge

**Compliance**: Every PR touching SEO rendering, link structure, or homepage
performance MUST verify compliance against the relevant Quality Gates. The
`/speckit-plan` command will include a Constitution Check gate referencing
these principles.

**Version**: 1.0.0 | **Ratified**: 2026-05-03 | **Last Amended**: 2026-05-03
