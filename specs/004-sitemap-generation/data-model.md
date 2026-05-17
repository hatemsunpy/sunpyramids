# Data Model: Dynamic Sitemap Generation

**Feature**: 004-sitemap-generation | **Date**: 2026-05-10

## Core Entities

### SitemapIndex

The top-level sitemap document listing all sub-sitemaps.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `sitemaps` | Array\<SitemapRef\> | List of sub-sitemap references (4 entries) | Built from route definitions |
| `sitemaps[n].loc` | URL | Full URL to sub-sitemap (e.g., `https://sunpyramidstours.com/sitemap-tours.xml`) | Route definitions + site config |
| `sitemaps[n].lastmod` | Date (YYYY-MM-DD) | Last modification date for the sub-sitemap | Current date at generation time |

**Invariants**:
- Must contain exactly 4 entries: pages, tours, blog, categories
- All `loc` values must use frontend domain (`https://sunpyramidstours.com`)
- No `xmlns:xhtml` on the index (only sub-sitemaps declare it)

### SubSitemap

A content-type-specific sitemap containing URLs plus hreflang alternates.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `urls` | Array\<SitemapUrl\> | List of URL entries for this content type | API response filtered by exclusion rules |
| `contentType` | Enum | `pages` \| `tours` \| `blog` \| `categories` | Route identity |

**Invariants**:
- Must contain ≤ 50,000 URLs
- On empty result set: return empty `<urlset>` (not 404)
- `xmlns:xhtml` declared on root `<urlset>` element
- UTF-8 encoded

### SitemapUrl

A single URL entry in a sub-sitemap.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `loc` | URL | Canonical page URL | API data: slug + locale path rules |
| `lastmod` | Date (YYYY-MM-DD) | Last modification date | API data: `updated_at` field; fallback: today |
| `hreflangs` | Array\<HreflangAlt\> | Translation alternates (one per available locale) | API data: `translations` array |
| `xDefault` | URL | x-default hreflang target | English (root path) variant of the same page |

**Invariants**:
- `loc` must use frontend domain
- `lastmod` must be valid YYYY-MM-DD
- At minimum: must have an x-default hreflang
- Maximum hreflang alternates: 7 (one per supported locale)
- URLs must be XML-escaped (special characters: `&`, `<`, `>`, `"`, `'`)

### HreflangAlt

A single hreflang alternate link.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `lang` | String | Locale code (fr, de, it, pt, es, zh) — never "en" | i18n config |
| `url` | URL | Full URL of the translated page | API data: locale-specific slug |
| `isXDefault` | Boolean | Whether this is the x-default entry | True only for English root-path URL |

**Invariants**:
- `lang` must be one of: fr, de, it, pt, es, zh (NOT "en")
- `url` must use frontend domain
- x-default always points to English root-path URL (no `/en` prefix)

### ExclusionRule

Criteria applied to API results to filter out non-indexable content.

| Rule | Applies to | Check |
|------|-----------|-------|
| Robots noindex | Pages, Tours, Blog | `item.seo.robots === 'noindex'` |
| Disabled/draft | Pages, Tours, Blog | `item.status !== 'published'` or equivalent |
| Arabic locale | All URLs | Locale !== 'ar' |
| Checkout page | Pages | Slug !== 'checkout' |
| Unsupported locale | All hreflangs | Locale in [en, fr, de, it, pt, es, zh] |
| English prefix | English URLs | No `/en/` in English URL path |

## Data Flow

```
                    ┌─────────────┐
  GET /sitemap.xml  │  Sitemap    │  4× <sitemap> entries
  ─────────────────>│  Index      │──────────────────────>
                    │  Route      │
                    └─────────────┘

                    ┌─────────────┐  GET /api/tours?...   ┌──────────┐
  GET /sitemap-     │  SubSitemap │──────────────────────>│ Laravel  │
  tours.xml ───────>│  Route      │<──────────────────────│   API    │
                    │             │   JSON: tours[]       └──────────┘
                    │  Apply      │
                    │  exclusion  │──> Filtered URLs
                    │  rules      │
                    │             │──> XML urlset
                    └─────────────┘
```

Each sub-sitemap route independently:
1. Fetches API data with 30s timeout
2. Filters out excluded items
3. Generates hreflang alternates per locale
4. Builds XML string
5. Returns with `Content-Type: application/xml; charset=utf-8`
