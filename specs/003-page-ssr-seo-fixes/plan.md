# Implementation Plan: Page-Level SSR SEO Fixes

**Branch**: `003-page-ssr-seo-fixes` | **Date**: 2026-05-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-page-ssr-seo-fixes/spec.md`

## Summary

Fix SSR blocking across 8 page templates that currently serve incomplete SEO metadata in their initial HTML. Five pages use a fire-and-forget async wrapper pattern that doesn't block the server response; the homepage has its SEO entirely commented out; and the tour detail page uses an unnecessarily indirect watcher pattern. Additionally, disable global NuxtLink prefetch to prevent wasted bandwidth, and verify that all navigation links remain crawlable `<a href>` elements.

## Technical Context

**Language/Version**: JavaScript (ES module), Nuxt 3.15.0 SSR, Vue 3 latest
**Primary Dependencies**: @nuxtjs/i18n ^9.1.1, useAsyncData/useFetch (Nuxt/Nitro), useSeo composable (Phase 2)
**Storage**: N/A (Laravel API backend at `https://sunpyramidtours.com/api/`)
**Testing**: No formal framework. Validation via curl-based smoke tests (per quickstart.md).
**Target Platform**: Server (Node.js SSR via Nitro) + Browser
**Project Type**: Web application — Nuxt 3 SSR frontend consuming Laravel REST API
**Performance Goals**: Homepage initial load reduces from dozens of prefetch requests to zero (bandwidth savings). No change to LCP/FCP.
**Constraints**: All SEO tags in initial HTML. No `hreflang="en"` (per Phase 2). No meta keywords in HTML. Backend domain must not appear in SEO URLs.
**Scale/Scope**: 8 page templates modified, 1 config file changed, 2 components verified. 7 locales.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I — Server-Rendered SEO First

| Status | ENABLING — these fixes ensure page templates actually await SEO data during SSR |
|--------|-------------------------------------------------------------------------------|
| **Evidence** | Every page currently missing SEO tags uses either a non-awaited async wrapper or commented-out code. The fix pattern (top-level `await` + direct `addSeo()`) is proven in `faqs.vue` and `blogs/all-blogs.vue`. |
| **Required fix** | Apply FR-001 through FR-011 as specified. |
| **Post-fix verification** | `curl` any of the 8 fixed pages and confirm complete SEO metadata in raw HTML. |

### Principle II — Dashboard-Driven, Never Hardcoded

| Status | COMPLIANT |
|--------|-----------|
| **Evidence** | All SEO data comes from `getData('pages/<slug>?includes=seo')` calls to the dashboard API. The only hardcoded value is the safe fallback title ("Sun Pyramids Tours") used when the API call fails — which is explicitly allowed by the constitution's degradation clause. |
| **Post-fix verification** | `grep -r` for hardcoded SEO strings in the modified files must return only the error-fallback site name. |

### Principle III — Multilingual Parity

| Status | COMPLIANT |
|--------|-----------|
| **Evidence** | X-Localize header is already set correctly per Phase 2. The page template fix doesn't alter locale handling. All 7 locales are verified in SC-007. |
| **Post-fix verification** | Cross-locale curl loop confirms locale-specific titles for all 7 locales. |

### Principle IV — Crawlable Links

| Status | COMPLIANT (verified, not fixed) |
|--------|-------------------------------|
| **Evidence** | The prefetch disable (`experimental.defaults.nuxtLink.prefetch: false`) only stops background fetch behavior; it does not alter the rendered DOM. `NuxtLink` always renders as `<a href="">`. GATE-11 verification confirms this. |
| **Post-fix verification** | View page source, disable JavaScript, confirm all links work. |

### Principle V — Performance Without Sacrificing Crawlability

| Status | COMPLIANT — this phase directly implements GATE-10 (prefetch control) |
|--------|-----------------------------------------------------------------------|
| **Evidence** | Global prefetch disable eliminates dozens of wasted text/html requests on homepage load without removing any links from the DOM. Header nav may selectively re-enable prefetch if UX degrades. |
| **Post-fix verification** | DevTools Network tab shows only one text/html document on homepage load. |

### Quality Gates (Pre-Implementation)

| Gate | Applicable? | Method |
|------|-------------|--------|
| GATE-01 | Yes | `curl` each fixed page — verify `<title>`, `<meta name="description">`, OG, Twitter, canonical, hreflang, schema in raw HTML |
| GATE-02 | Yes | `curl \| grep "og:" \| grep 'name="og:"'` — must be empty (OG tags use `property`) |
| GATE-03 | Yes | `curl \| grep -i "keywords"` — must be empty |
| GATE-04 | Yes | `curl \| grep "sunpyramidtours.com"` — backend domain absent from SEO URLs |
| GATE-05 | Yes | `curl \| grep "ld+json"` — valid schema present, invalid skipped |
| GATE-06 | Yes | `curl \| grep "hreflang"` — no `hreflang="en"`, x-default present |
| GATE-07 | No | Sitemap in Phase 4 |
| GATE-08 | No | Full audit in Polish phase |
| GATE-09 | No | Full audit in Polish phase |
| GATE-10 | Yes | DevTools Network → only homepage document on initial load |
| GATE-11 | Yes | View source → all card links are `<a href="">` elements |
| GATE-12 | No | Lighthouse in Polish phase |

## Project Structure

### Documentation (this feature)

```text
specs/003-page-ssr-seo-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── page-template-contract.md
│   └── prefetch-config-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
pages/
├── index.vue                              # FIX: uncomment SEO block
├── contact-us.vue                         # FIX: remove async wrapper, add top-level await
├── about-us.vue                           # FIX: remove async wrapper, add top-level await
├── tour/[id].vue                          # SIMPLIFY: replace watcher with direct addSeo
├── egypt-travel-guide/
│   ├── index.vue                          # FIX: remove async wrapper, fix un-awaited getData
│   └── [cate]/index.vue                   # FIX: remove async wrapper, add top-level await
├── egypt-tours/
│   ├── nile-cruises/index.vue             # FIX: remove async wrapper, add top-level await
│   ├── shore-excursions/index.vue         # FIX: remove async wrapper, add top-level await
│   ├── one-day-tours/index.vue            # VERIFY: already correct
│   └── multi-days-tours/index.vue         # VERIFY: already correct
├── faqs.vue                               # VERIFY: already correct (reference pattern)
├── blogs/all-blogs.vue                    # VERIFY: already correct (reference pattern)
└── blog/[slug].vue                        # VERIFY: already correct

components/
├── Event/index.vue                        # VERIFY: correct pattern, depends on parent page await
└── MarktingPages/index.vue                # VERIFY: correct pattern, depends on parent page await

nuxt.config.ts                             # MODIFY: add prefetch: false
```

**Structure Decision**: Single web application (frontend only). Eight page templates modified, one config file changed, six pages and two components verified. No new files or directories needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |

All constitution principles are either complied with or not applicable to this phase's scope.

---

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design (research.md, data-model.md, contracts/).*

### Principle I — Server-Rendered SEO First → ENABLING

The research.md confirms all 8 fixes use the proven top-level `await` + direct `addSeo()` pattern. The page-template contract codifies this as an invariant. Every fix operates at the SSR render path, blocking the server response until SEO data resolves.

### Principle II — Dashboard-Driven → COMPLIANT

All SEO data sourced from `getData('pages/<slug>?includes=seo')`. Safe fallback allowed per constitution degradation clause.

### Principle III — Multilingual Parity → COMPLIANT

X-Localize header handled by Phase 2 `useApi.js`. No locale handling changes in page templates.

### Principle IV — Crawlable Links → COMPLIANT

Prefetch disable confirmed to not alter rendered DOM. GATE-11 verification ensures link preservation.

### Principle V — Performance → COMPLIANT

Prefetch disable directly satisfies GATE-10. No performance degradation to LCP/FCP. Header nav selectively re-enabled if needed.
