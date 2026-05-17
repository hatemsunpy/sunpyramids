# Research: Lighthouse Performance & SEO Validation

**Feature**: 005-lighthouse-validation | **Date**: 2026-05-12

## Decision 1: `?no-third-party=1` Implementation

**Decision**: Add a reactive check in `app.vue` to conditionally skip GTM/GA4 `useHead` injection when `route.query['no-third-party']` is present. The reCAPTCHA script in `nuxt.config.ts` (async+defer, negligible perf impact) is left unchanged.

**Rationale**: The GTM/GA4 scripts in `app.vue` are the primary performance culprits — they load synchronously via `useHead` with inline script execution. Making them conditional on a query parameter is a 5-line change in a single file. The reCAPTCHA script is already `async` + `defer`, so it does not block rendering or contribute meaningfully to Lighthouse scores. Moving it out of `nuxt.config.ts` to make it conditional would add complexity without measurable benefit.

**Alternatives considered**:
- **Middleware-based approach**: A global middleware that sets a flag via `useState`, consumed by `app.vue`. Overengineered for a diagnostic-only parameter; direct `useRoute().query` check in `app.vue` is simpler.
- **Plugin-based dynamic head manipulation**: Would require a plugin to hook into `useHead` updates. More code for the same outcome.
- **Suppress reCAPTCHA too**: The reCAPTCHA script loads from `nuxt.config.ts` app.head, which is build-time static. Making it conditional requires restructuring — not worth it for an async+defer script.

## Decision 2: Lighthouse Audit Tooling

**Decision**: Use Chrome DevTools Lighthouse tab for interactive audits, with the Lighthouse PSI API or CLI as a fallback for repeated runs.

**Rationale**: This is a manual one-time quality gate. Chrome DevTools is already installed, requires no setup, and produces identical scores to the CLI. No additional dependencies needed.

**Alternatives considered**:
- **Lighthouse CI**: Automated, repeatable, but adds infrastructure complexity and flaky-result management — explicitly out of scope per spec.
- **Lighthouse Node CLI (`lighthouse`)**: Headless, scriptable. Useful as a fallback if Chrome DevTools results need verification. Not required as primary tooling.
- **PageSpeed Insights API**: Provides field data (CrUX) in addition to lab data. Could supplement lab-only DevTools results but adds API key management.

## Decision 3: Baseline Strategy

**Decision**: Check `docs/seo-validation/` for existing baseline reports. If found, use as comparison baseline. If not found, use absolute thresholds: SEO ≥ 90 (or =100 depending on page), LCP < 2.5s, TBT < 200ms, CLS < 0.1.

**Rationale**: The spec already accounts for missing baselines ("Pre-fix baseline exists or absolute thresholds used"). Since this is a pre-release validation gate for fixes that should improve scores, absolute thresholds are acceptable as the comparison baseline.

**Alternatives considered**:
- **Always use absolute thresholds**: Simpler, but loses the ability to demonstrate improvement from a known low baseline.
- **Generate baseline now from staging without fixes**: Not possible if fixes are already deployed to staging.

## Decision 4: Audit Execution Sequence

**Decision**: Run audits in this order: (1) curl pre-check on English homepage, (2) Lighthouse on English homepage (mobile, no throttling baseline), (3) English tour detail page, (4) remaining homepage locales, (5) remaining tour detail locales, (6) English static pages, (7) Slow 4G throttling re-run, (8) desktop profile re-run, (9) `?no-third-party=1` diagnostic runs.

**Rationale**: Start with the most critical page (English homepage) to catch showstopper issues early. If the English homepage fails, stop and fix before auditing 17 combinations.

**Alternatives considered**:
- **Batch all locales at once**: More efficient if all pass, but wastes time if a systemic issue causes all to fail.

## Decision 5: Report Structure

**Decision**: Use a structured Markdown template with per-page tables, summary statistics, and a final GATE-12 verdict section.

**Rationale**: Markdown is version-controlled, human-readable, and requires no tooling to produce or consume. The template ensures consistency across all 17 entries.
