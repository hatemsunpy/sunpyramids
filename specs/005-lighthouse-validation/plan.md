# Implementation Plan: Lighthouse Performance & SEO Validation

**Branch**: `005-lighthouse-validation` | **Date**: 2026-05-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-lighthouse-validation/spec.md`

## Summary

Manual one-time pre-release quality gate that validates SEO fixes from specs 002, 003, and 004. A developer runs Lighthouse audits against 17 page-locale combinations, produces a structured Markdown validation report, and renders a GATE-12 pass/fail verdict. One small code change is required: adding `?no-third-party=1` support to suppress GTM/GA4 scripts for diagnostic comparison.

## Technical Context

**Language/Version**: TypeScript/Vue 3 (Nuxt 3.15) — the project under test
**Primary Dependencies**: Chrome DevTools Lighthouse, curl, `app.vue` (for `?no-third-party=1` change)
**Storage**: N/A (output is a Markdown file at `docs/seo-validation/phase-5-lighthouse-validation-report.md`)
**Testing**: Manual Lighthouse audits via Chrome DevTools; curl pre-checks
**Target Platform**: Web — staging/production environment against `https://sunpyramidstours.com`
**Project Type**: Manual quality gate / validation phase + 1 minor code change
**Performance Goals**: LCP < 2.5s (mobile), TBT regression < 50ms from baseline, CLS < 0.1
**Constraints**: 17 page-locale combinations, manual execution by one developer, zero confirmed failures tolerated
**Scale/Scope**: 7 locales (en, fr, de, it, pt, es, zh), 3 page types, 1 diagnostic query parameter

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status |
|------|-------------|--------|
| GATE-01 (curl) | SEO tags in raw HTML before audits | ☐ Validated during execution |
| GATE-02 (OG attributes) | `property=""` not `name=""` | ☐ Checked during pre-audit curl |
| GATE-03 (Keywords absent) | No `<meta name="keywords">` | ☐ Checked during pre-audit curl |
| GATE-04 (Domain separation) | Backend domain absent from SEO URLs | ☐ Checked during pre-audit curl |
| GATE-05 (Schema valid) | Valid JSON-LD structure_schema | ☐ Validated in Phase 2-4 already |
| GATE-06 (Hreflang dynamic) | Dynamic hreflang, x-default=en | ☐ Checked during pre-audit curl |
| GATE-07 (Sitemap valid) | Valid XML sitemap | ☐ Validated in 004-sitemap-generation |
| GATE-08 (No hardcoding) | Zero hardcoded SEO values | ☐ Verified in 002-seo-foundational-fixes |
| GATE-09 (No duplicates) | Single canonical, robots, description | ☐ Checked during pre-audit curl |
| GATE-10 (Prefetch controlled) | Only main document on homepage load | ☐ Validated in 003-page-ssr-seo-fixes |
| GATE-11 (Links crawlable) | Real `<a href>` elements | ☐ Validated in 003-page-ssr-seo-fixes |
| GATE-12 (Lighthouse) | SEO improves from baseline, CWV don't worsen | **This phase** |

**Pre-design verdict**: All prior gates (1-11) are assumed passing from specs 002-004. GATE-12 is the sole focus of this phase. No constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/005-lighthouse-validation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── no-third-party-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
# Single change: app.vue (conditional GTM/GA4 suppression)
app.vue                   # Add route.query['no-third-party'] check around GTM/GA4 useHead block
nuxt.config.ts            # No changes (reCAPTCHA stays as async+defer)

# Report output
docs/seo-validation/
└── phase-5-lighthouse-validation-report.md
```

**Structure Decision**: Single-file change (`app.vue`) for the `?no-third-party=1` mechanism. No new files, no architectural changes. The bulk of this phase is manual audit execution, not development.

## Complexity Tracking

No violations. No complexity to justify.
