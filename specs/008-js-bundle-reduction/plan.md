# Implementation Plan: JavaScript Bundle Reduction

**Branch**: `008-js-bundle-reduction` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-js-bundle-reduction/spec.md`

## Summary

Reduce the initial JavaScript and CSS payload by ~130KB+ through four targeted optimizations: (1) enabling lazy i18n loading so only the active locale is bundled, (2) marking the vue3-toastify plugin as client-only to remove it from SSR, (3) deduplicating Swiper CSS imports from 27 components into a single global entry, and (4) removing the duplicate @vercel/speed-insights module registration and scoping datepicker CSS to its consuming components. Combined, these changes target a 20%+ reduction in initial JS bundle size with no visual or functional regressions.

## Technical Context

**Language/Version**: JavaScript (ESNext), Nuxt 3.15.0, Vue 3 (latest)
**Primary Dependencies**: @nuxtjs/i18n ^9.1.1, nuxt-swiper ^1.2.2, vue3-toastify ^0.2.8, @vercel/speed-insights ^2.0.0, @vuepic/vue-datepicker ^11.0.0
**Storage**: N/A (no data persistence changes)
**Testing**: Manual visual verification + `npm run build` (no automated test suite exists)
**Target Platform**: Web (SSR + client-side hydration), deployed to Vercel
**Project Type**: Nuxt 3 SSR web application (tourism/travel booking)
**Performance Goals**: >=20% reduction in initial JS bundle size (total `_nuxt/` JS payload on homepage); single locale file fetched per page load; zero build errors
**Constraints**: Must not break SSR SEO (server-rendered translated content preserved), all 7 Swiper carousels must render identically, toast notifications must function identically, Speed Insights must continue collecting data
**Scale/Scope**: 50 pages, 170 components, 7 locale files (~153KB total), 27 components with Swiper CSS imports, 2 datepicker components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Server-Rendered SEO First

| Gate | Status | Notes |
|------|--------|-------|
| Translated content renders in raw HTML without JS | ✅ PASS | Lazy i18n defers only INACTIVE locale files. The active locale still loads server-side and renders translated content during SSR. @nuxtjs/i18n v9+ lazy mode renders the default/active locale eagerly; only language switches trigger lazy loads. |

### Principle II: Dashboard-Driven, Never Hardcoded

| Gate | Status | Notes |
|------|--------|-------|
| No hardcoded SEO values introduced | ✅ PASS | No SEO values are added, removed, or changed. This phase only touches CSS imports, plugin registration, and i18n module config. |

### Principle III: Multilingual Parity

| Gate | Status | Notes |
|------|--------|-------|
| All 7 locales continue to work | ✅ PASS | Lazy i18n preserves all 7 locales. Each locale file is loaded on demand when the user switches language. The `langDir` path must be corrected from `locales/` to `i18n/locales/` for lazy loading to resolve files correctly. |
| Hreflang unaffected | ✅ PASS | No hreflang or SEO tag changes. |

### Principle IV: Crawlable Links, Never Hidden

| Gate | Status | Notes |
|------|--------|-------|
| No link structure changes | ✅ PASS | No navigation, link, or anchor changes. |

### Principle V: Performance Without Sacrificing Crawlability

| Gate | Status | Notes |
|------|--------|-------|
| Performance optimization must not damage SEO | ✅ PASS | All optimizations are CSS/JS payload reductions. No link structure, metadata, or crawlability changes. Lazy i18n preserves server-rendered content for the active locale. |
| NuxtLink prefetch unchanged | ✅ PASS | Existing prefetch controls (experimental.defaults.nuxtLink.prefetch: false) are preserved. |

### Quality Gates (from Constitution)

| Gate | Relevance | Status |
|------|-----------|--------|
| GATE-01 through GATE-11 | Not directly affected | ✅ N/A — no SEO tag, link, canonical, hreflang, schema, or sitemap changes |
| GATE-12 (Lighthouse LCP/TBT) | Directly relevant | ✅ PASS — expected TBT improvement from smaller JS bundle; LCP unaffected or improved |

### Constitution Verdict

**All gates pass.** No violations or complexity tracking entries needed. This feature is a pure performance optimization that aligns with Principle V.

## Project Structure

### Documentation (this feature)

```text
specs/008-js-bundle-reduction/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
# Nuxt 3 SSR web application
app.vue                     # Root component (datepicker CSS global import)
nuxt.config.ts              # Nuxt config (modules, plugins, i18n, CSS)
i18n/
├── Helpers/
│   └── config.js           # Locale definitions (7 languages)
└── locales/                # Locale JSON files (~153KB total)
    ├── en.json             # 21.3 KB
    ├── de.json             # 23.4 KB
    ├── es.json             # 22.8 KB
    ├── fr.json             # 22.8 KB
    ├── it.json             # 21.5 KB
    ├── pt.json             # 21.7 KB
    └── zh.json             # 19.3 KB
plugins/
├── vue3-toastify.js        # → RENAME to vue3-toastify.client.js
├── vue-awesome-paginate.client.js
├── vueGoogleMaps.client.ts
├── vercel-analytics.client.ts   # Disabled no-op (candidate for removal)
└── clear-payload.client.ts      # Disabled no-op (candidate for removal)
components/
├── UI/
│   ├── Date.vue            # Imports @vuepic/vue-datepicker (→ add CSS import)
│   └── Shortcuts/
│       └── Date.vue        # Imports @vuepic/vue-datepicker (→ add CSS import)
├── Home/MainBanner/        # Swiper CSS removal (60+ imports across 27 components)
├── Tours/LeftPanal/        # Swiper CSS removal
├── Shared/                 # Swiper CSS removal
└── ...                     # (see research.md for full list of 27 affected components)
```

**Structure Decision**: This is a Nuxt 3 SSR web application. All changes are configuration-level (nuxt.config.ts, plugin renames, CSS import moves). No new files or directories are created. The existing project structure is preserved.

## Complexity Tracking

> No constitution violations. This section intentionally left empty.
