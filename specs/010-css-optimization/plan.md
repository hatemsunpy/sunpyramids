# Implementation Plan: CSS Optimization for First Contentful Paint

**Branch**: `010-css-optimization` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-css-optimization/spec.md`

## Summary

Optimize CSS delivery for improved First Contentful Paint by: (1) inlining critical above-the-fold CSS into the HTML head for static top-level marketing pages using the `beasties` package, (2) moving Swiper CSS imports from global configuration to component-level for automatic route-based code splitting, and (3) removing unused CSS rules from SCSS files via PurgeCSS in production builds. Targets ≥8% FCP improvement and ≥30% CSS payload reduction with zero visual regressions.

## Technical Context

**Language/Version**: JavaScript (ESNext), TypeScript 5.x, Nuxt 3.15.0, Vue 3
**Primary Dependencies**: beasties (critical CSS inline), @fullhuman/postcss-purgecss (unused CSS removal), nuxt-swiper (already present)
**Storage**: N/A (no data persistence changes; CSS cache state via HTTP cookie only)
**Testing**: Manual visual verification + `npm run build` (no automated test suite exists)
**Target Platform**: Web (SSR + client-side hydration), deployed to Vercel
**Project Type**: Nuxt 3 SSR web application (tourism/travel booking)
**Performance Goals**: ≥8% FCP improvement, ≥30% CSS size reduction, zero visual regressions, ≤30s build time increase
**Constraints**: Must preserve SSR SEO (no changes to server-rendered content structure), must preserve all 7 locales, must not modify third-party CSS content, critical CSS limited to static top-level pages only, 14KB inline cap per page
**Scale/Scope**: 1 new Nuxt module file, 1 modified PostCSS config, modifications to ~4 component files (CSS import additions), 1 modified nuxt.config.ts, ~6 static page routes + locale variants receive critical CSS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Server-Rendered SEO First

| Gate | Status | Notes |
|------|--------|-------|
| Translated content renders in raw HTML without JS | ✅ PASS | CSS inlining adds styles to `<head>` but does not change or hide any content. Server-rendered HTML structure is preserved. |

### Principle II: Dashboard-Driven, Never Hardcoded

| Gate | Status | Notes |
|------|--------|-------|
| No hardcoded SEO values introduced | ✅ PASS | No SEO values are added, removed, or changed. CSS paths and class names are technical, not content. |

### Principle III: Multilingual Parity

| Gate | Status | Notes |
|------|--------|-------|
| All 7 locales continue to work | ✅ PASS | Critical CSS whitelist includes all locale variants. CSS purging and splitting are language-agnostic. |
| Hreflang unaffected | ✅ PASS | No hreflang or SEO tag changes. |

### Principle IV: Crawlable Links, Never Hidden

| Gate | Status | Notes |
|------|--------|-------|
| No link structure changes | ✅ PASS | No navigation, link, or anchor changes. |

### Principle V: Performance Without Sacrificing Crawlability

| Gate | Status | Notes |
|------|--------|-------|
| Performance optimization must not damage SEO | ✅ PASS | CSS optimization only affects visual presentation. Crawlers receive the same HTML content. Inline CSS in `<head>` is standard and does not harm crawlability. |
| NuxtLink prefetch unchanged | ✅ PASS | Existing prefetch controls preserved. |

### Quality Gates (from Constitution)

| Gate | Relevance | Status |
|------|-----------|--------|
| GATE-01 through GATE-11 | Not directly affected | ✅ N/A — no SEO tag, link, canonical, hreflang, schema, or sitemap changes |
| GATE-12 (Lighthouse LCP/TBT) | Directly relevant | ✅ PASS — expected FCP improvement from CSS optimization |

### Post-Design Re-Check (Phase 1 Complete)

| Principle | Status | Notes |
|-----------|--------|-------|
| I: SSR SEO First | ✅ PASS | Verified: critical CSS injection is server-side only. Raw HTML content unchanged. |
| II: Dashboard-Driven | ✅ PASS | Verified: no new hardcoded content values. CSS configuration is technical. |
| III: Multilingual Parity | ✅ PASS | Verified: all 7 locale variants in route whitelist. |
| IV: Crawlable Links | ✅ PASS | Verified: no link changes. |
| V: Performance Without Sacrificing Crawlability | ✅ PASS | Verified: CSS optimization is performance-only, zero SEO impact. |

### Constitution Verdict

**All gates pass.** No violations. This feature is a pure CSS performance optimization aligned with Principle V.

## Project Structure

### Documentation (this feature)

```text
specs/010-css-optimization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── css-optimization-contracts.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
# Files to CREATE (2 new)
modules/
└── critical-css.ts                  # NEW: beasties-based critical CSS Nuxt module
postcss.config.js                    # NEW (if absent): PostCSS config with PurgeCSS

# Files to MODIFY (5 existing)
nuxt.config.ts                       # Remove Swiper CSS from css:[] array, add criticalCSS config
assets/styles/main.scss              # Audit for unused rules (content review, not structural change)
components/Home/index.vue            # Add import 'swiper/css' etc. (if this component uses Swiper)
components/Tours/index.vue           # Add import 'swiper/css' etc.
components/Event/index.vue           # Add import 'swiper/css/pagination' etc.
components/Events/index.vue          # Add import 'swiper/css' etc.
```

**Structure Decision**: Single-project Nuxt 3 SSR web application. One new module file (`modules/critical-css.ts`) encapsulates all critical CSS logic. One new PostCSS config centralizes PurgeCSS settings. Existing components receive CSS import additions only — no structural changes.

## Complexity Tracking

> No violations. Table is empty.
