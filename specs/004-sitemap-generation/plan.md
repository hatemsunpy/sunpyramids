# Implementation Plan: Dynamic Sitemap Generation

**Branch**: `004-sitemap-generation` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-sitemap-generation/spec.md`

## Summary

Replace the 820KB static `public/sitemap.xml` with a dynamic sitemap index and four sub-sitemaps served via Nitro server routes. Each sub-sitemap fetches live data from the Laravel API (pages, tours, blogs, categories) and generates XML with proper hreflang alternates for all 7 supported locales. Excludes non-indexable content (noindex, disabled, draft, Arabic locale, checkout page) per the sitemap contract from Phase 1.

## Technical Context

**Language/Version**: JavaScript (ES module), Nuxt 3.15.0 SSR, Vue 3 latest
**Primary Dependencies**: @nuxtjs/i18n ^9.1.1, Nitro server routes (built-in), $fetch (Nitro), useSeo composable (Phase 2)
**Storage**: N/A (Laravel API backend at `https://sunpyramidtours.com/api/`)
**Testing**: No formal framework. Validation via curl + XML schema validators per quickstart.md.
**Target Platform**: Server (Node.js SSR via Nitro server routes)
**Project Type**: Web application — Nuxt 3 SSR frontend consuming Laravel REST API
**Performance Goals**: Each sub-sitemap responds within 30s (API timeout). No server-side caching on initial implementation (HTTP caching headers may be added later).
**Constraints**: All URLs use `https://sunpyramidstours.com`. XML well-formed, UTF-8 encoded, valid against sitemaps.org schema. Backend domain MUST NOT appear in any sitemap URL. Zero hardcoded marketing page slugs.
**Scale/Scope**: 5 server route files, 4 sub-sitemaps, 7 locales, ~2000 URLs total across all sub-sitemaps. Well under 50k URL limit per sub-sitemap.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I — Server-Rendered SEO First

| Status | COMPLIANT — sitemaps are inherently server-rendered XML |
|--------|-------------------------------------------------------|
| **Evidence** | Sitemap routes are Nitro server routes that return raw XML. No JavaScript execution needed for crawlers to parse sitemap content. |
| **Post-fix verification** | `curl /sitemap.xml` returns valid XML sitemap index. `curl` each sub-sitemap returns valid XML urlset. |

### Principle II — Dashboard-Driven, Never Hardcoded

| Status | COMPLIANT — all content URLs sourced from live API data |
|--------|-------------------------------------------------------|
| **Evidence** | Tours, blogs, categories, and custom marketing pages are fetched from API endpoints dynamically. Static page routes (about-us, contact-us, etc.) are known application routes, not SEO values — listing them in a sitemap route is equivalent to defining them in `pages/` directory structure. Marketing page slugs are NOT hardcoded — discovered via API. |
| **Post-fix verification** | Publish a new tour and `curl /sitemap-tours.xml` — new tour appears. Create a new marketing page in dashboard — appears in `/sitemap-pages.xml`. |

### Principle III — Multilingual Parity

| Status | COMPLIANT — all 7 supported locales included, hreflang alternates generated dynamically |
|--------|----------------------------------------------------------------------------------------|
| **Evidence** | Each sub-sitemap iterates over the 7 supported locales (en, fr, de, it, pt, es, zh) to generate hreflang alternates. English has no `/en` prefix. x-default points to English root URL. Arabic excluded. |
| **Post-fix verification** | `curl /sitemap-tours.xml | grep "hreflang"` shows 7 hreflang values, no `hreflang="en"`, x-default present. |

### Principle IV — Crawlable Links

| Status | NOT APPLICABLE |
|--------|---------------|
| **Evidence** | Sitemaps are XML documents listing URLs — they don't contain navigation links. This principle applies to rendered HTML pages, not XML data feeds. |

### Principle V — Performance Without Sacrificing Crawlability

| Status | NOT APPLICABLE |
|--------|---------------|
| **Evidence** | Sitemaps are crawler tools, not user-facing pages. Performance considerations (API timeout, XML size) are addressed in Technical Context and Edge Cases, but the "prefetch on card links" concern from Principle V does not apply to XML sitemaps. |

### Quality Gates (Pre-Implementation)

| Gate | Applicable? | Method |
|------|-------------|--------|
| GATE-01 | Yes | `curl /sitemap.xml` returns valid XML sitemap index |
| GATE-02 | No | OG attributes — N/A for XML sitemaps |
| GATE-03 | No | Meta keywords — N/A for XML sitemaps |
| GATE-04 | Yes | `curl` all sitemaps → zero `sunpyramidtours.com` (backend domain) |
| GATE-05 | No | Schema JSON-LD — N/A for XML sitemaps |
| GATE-06 | Yes | `curl` sub-sitemaps → no `hreflang="en"`, x-default present |
| GATE-07 | Yes | `curl /sitemap.xml` returns valid XML, frontend domain, indexable pages only |
| GATE-08 | No | Hardcoded SEO check — N/A (this IS the sitemap) |
| GATE-09 | No | Duplicate tag check — N/A for XML sitemaps |
| GATE-10 | No | Prefetch control — N/A for XML sitemaps |
| GATE-11 | No | Crawlable links — N/A for XML sitemaps |
| GATE-12 | No | Lighthouse — N/A for XML sitemaps |

## Project Structure

### Documentation (this feature)

```text
specs/004-sitemap-generation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── sitemap-route-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
server/
├── routes/
│   ├── sitemap.xml.ts              # NEW: Sitemap index route
│   ├── sitemap-pages.xml.ts        # NEW: Pages + marketing pages sub-sitemap
│   ├── sitemap-tours.xml.ts        # NEW: Tours sub-sitemap
│   ├── sitemap-blog.xml.ts         # NEW: Blog sub-sitemap
│   └── sitemap-categories.xml.ts   # NEW: Categories sub-sitemap
├── middleware/
│   └── redirect-http-protocol.ts   # Existing: unchanged

public/
└── sitemap.xml                     # REMOVE: replaced by dynamic route
```

**Structure Decision**: Five new Nitro server route files under `server/routes/` — one per sitemap endpoint. No frontend components or pages needed. The static `public/sitemap.xml` is deleted to prevent conflicts with the dynamic route. This is a pure backend/server-route feature within the existing Nuxt frontend application.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |

All constitution principles are either complied with or not applicable to this feature's scope.

---

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design (research.md, data-model.md, contracts/).*

### Principle I — Server-Rendered SEO First → COMPLIANT

Nitro server routes render XML directly on the server. No client-side JavaScript involved. The research.md confirms the standard Nitro `setHeader('content-type', 'application/xml')` + string template pattern.

### Principle II — Dashboard-Driven → COMPLIANT

All content fetched from live API endpoints. Static page list is a route map (equivalent to the `pages/` directory), not hardcoded SEO values. Marketing pages discovered dynamically via `getData('pages?type=marketing&includes=seo')`.

### Principle III — Multilingual Parity → COMPLIANT

All 7 locales included via `i18nConfig.locales` iteration. Hreflang alternates generated dynamically per URL. English root path (no `/en`), x-default, Arabic excluded.

### Principle IV — Crawlable Links → NOT APPLICABLE (XML feed)

### Principle V — Performance → NOT APPLICABLE (XML feed)
