# Data Model: Page-Level SSR SEO Fixes

**Feature**: 003-page-ssr-seo-fixes | **Date**: 2026-05-04

## Entities

### PageSEOData

Represents the complete SEO metadata bundle for a single page, fetched from the dashboard API and rendered into `<head>` tags.

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `meta_title` | string | No | Dashboard page.seo | HTML `<title>` content |
| `meta_description` | string | No | Dashboard page.seo | HTML `<meta name="description">` content |
| `og_title` | string | No | Dashboard page.seo | Open Graph title (overrides `meta_title` for OG) |
| `og_description` | string | No | Dashboard page.seo | Open Graph description (overrides `meta_description` for OG) |
| `og_image` | string | No | Dashboard page.seo | Open Graph image URL |
| `og_type` | string | No | Dashboard page.seo | Open Graph type (e.g., "website", "article") |
| `twitter_title` | string | No | Dashboard page.seo | Twitter card title |
| `twitter_description` | string | No | Dashboard page.seo | Twitter card description |
| `twitter_image` | string | No | Dashboard page.seo | Twitter card image URL |
| `twitter_card` | string | No | Dashboard page.seo | Twitter card type (e.g., "summary_large_image") |
| `structure_schema` | string\|object\|array | No | Dashboard page.seo | JSON-LD structured data |
| `meta_keywords` | string | No | Dashboard page.seo | Internal field — MUST NOT render in HTML |
| `availableLocales` | string[] | No | Derived from translations | Locale codes with translations for hreflang |

**Validation rules**:
- All string fields may be empty, null, or missing — fallback chains handle this
- `structure_schema` accepts three formats: parsed object, JSON string, array (validated by `validateAndParseSchema()` per Phase 2)
- `meta_keywords` is stored for dashboard use but excluded from public HTML (enforced by Phase 2 FR-005)
- `availableLocales` may be empty — x-default hreflang still renders

**State transitions**: None. PageSEOData is read-only (rendered from API response into HTML).

### PageTemplate

Represents a single Vue page component in the `pages/` directory. Each template follows one of three SSR-SEO patterns.

| Pattern | Mechanism | SSR Blocks? | Files |
|---------|-----------|:-----------:|-------|
| **Correct** | Top-level `await getData()` + direct `addSeo()` | Yes | faqs.vue, blogs/all-blogs.vue, blog/[slug].vue, one-day-tours/index.vue, multi-days-tours/index.vue |
| **Broken — async wrapper** | Async function wraps fetch, called without `await` | No | contact-us.vue, about-us.vue, egypt-travel-guide/index.vue, nile-cruises/index.vue, shore-excursions/index.vue, egypt-travel-guide/[cate]/index.vue |
| **Broken — commented out** | SEO fetch commented out entirely | No | index.vue |
| **Working — indirect** | Top-level `await` + `watch({ immediate: true })` wrapper | Yes (but fragile) | tour/[id].vue |

**Transformations (this phase)**:
- **Broken → Correct**: Remove async wrapper function, inline `await getData()` at top level, call `addSeo()` directly
- **Commented out → Correct**: Uncomment, align with correct pattern
- **Working — indirect → Correct**: Remove watcher, replace with direct `addSeo()` call

### PrefetchConfig

Controls Nuxt's NuxtLink prefetch behavior. Currently uses Nuxt defaults (prefetch enabled globally).

| Setting | Default | Phase 3 Value | Effect |
|---------|---------|---------------|--------|
| `experimental.defaults.nuxtLink.prefetch` | `true` | `false` | Disables automatic prefetch of all NuxtLink targets |
| Header nav `:prefetch` prop | (inherits global) | `true` (selectively) | Re-enables prefetch on header navigation if needed |

**Validation rules**:
- Prefetch disable must not alter DOM — links remain `<a href="">` elements
- Header navigation UX must not degrade — if it does, re-enable selectively on header components only
- All card/listing links must remain unprefetched: tours, blogs, destinations, categories, footer

### ErrorBoundary

Wraps the SEO data fetch in each page template to handle failures gracefully.

| Failure Mode | Page Behavior |
|--------------|---------------|
| API returns 5xx | Render page with fallback title, no SEO tags, status 200 |
| API timeout (>30s) | Render page with fallback title, no SEO tags, status 200 |
| Malformed response | Render page with fallback title, no SEO tags, status 200 |
| Network error | Render page with fallback title, no SEO tags, status 200 |

**Fallback title**: "Sun Pyramids Tours" (site name)
**Fallback description**: Empty (not rendered)
**Logging**: `console.warn()` for this phase (deferred: formal logger in polish phase, per Phase 2 T027)

## Relationships

```
Dashboard API
    │
    │ ?includes=seo
    ▼
PageSEOData ───────────► addSeo() ───────────► useHead() ───────────► HTML <head>
    │                        │
    │ try/catch              │ must be called
    │ on fetch               │ during SSR render pass
    ▼                        ▼
ErrorBoundary            PageTemplate pattern
(fallback title)         (top-level await)
```
