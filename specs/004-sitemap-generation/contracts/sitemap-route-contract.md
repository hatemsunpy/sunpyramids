# Sitemap Route Contract

**Feature**: 004-sitemap-generation | **Date**: 2026-05-10
**Parent Contract**: [specs/001-seo-rendering-fix/contracts/sitemap-contract.md](../../001-seo-rendering-fix/contracts/sitemap-contract.md)

This contract defines the server route implementations that fulfill the Phase 1 sitemap contract.

## Route Definitions

| Route | File | Response |
|-------|------|----------|
| `GET /sitemap.xml` | `server/routes/sitemap.xml.ts` | Sitemap Index XML |
| `GET /sitemap-pages.xml` | `server/routes/sitemap-pages.xml.ts` | Pages URL Set XML |
| `GET /sitemap-tours.xml` | `server/routes/sitemap-tours.xml.ts` | Tours URL Set XML |
| `GET /sitemap-blog.xml` | `server/routes/sitemap-blog.xml.ts` | Blog URL Set XML |
| `GET /sitemap-categories.xml` | `server/routes/sitemap-categories.xml.ts` | Categories URL Set XML |

## GET /sitemap.xml — Sitemap Index

### Response

- Status: 200
- Content-Type: `application/xml; charset=utf-8`

### XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://sunpyramidstours.com/sitemap-pages.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://sunpyramidstours.com/sitemap-tours.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://sunpyramidstours.com/sitemap-blog.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://sunpyramidstours.com/sitemap-categories.xml</loc>
    <lastmod>2026-05-10</lastmod>
  </sitemap>
</sitemapindex>
```

### Behavior

- Always returns 200 with all 4 `<sitemap>` entries (even if sub-sitemaps would be empty).
- `lastmod` for each entry is the current date (sitemap is generated fresh per request).
- No API calls needed — index is static XML built from route knowledge.

## GET /sitemap-pages.xml — Static + Marketing Pages

### Data Source

1. `GET https://sunpyramidtours.com/api/pages?type=static&includes=seo` — core static pages
2. `GET https://sunpyramidtours.com/api/pages?type=marketing&includes=seo` — custom marketing pages

### URL Generation

For each page returned:
- English URL: `https://sunpyramidstours.com/{slug}`
- Non-English URL: `https://sunpyramidstours.com/{locale}/{slug}`

### Filters Applied

- `item.seo.robots !== 'noindex'`
- `item.status === 'published'`
- `item.slug !== 'checkout'`

### XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://sunpyramidstours.com/about-us</loc>
    <lastmod>2026-04-28</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://sunpyramidstours.com/about-us" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://sunpyramidstours.com/fr/a-propos" />
    <xhtml:link rel="alternate" hreflang="de" href="https://sunpyramidstours.com/de/uber-uns" />
  </url>
</urlset>
```

### Error Response

On API failure or timeout (30s): Return empty `<urlset>` (200 OK).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
</urlset>
```

## GET /sitemap-tours.xml — All Published Tours

### Data Source

`GET https://sunpyramidtours.com/api/tours?includes=seo,destinations,translations&page_limit=500`

### URL Generation

For each tour + each available locale:
- English: `https://sunpyramidstours.com/tour/{tour.slug}`
- Non-English: `https://sunpyramidstours.com/{locale}/tour/{tour.translations[locale].slug}`

### Filters Applied

- `tour.seo.robots !== 'noindex'`
- `tour.status === 'published'` or equivalent
- Exclude tours whose primary slug is null/empty

### XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://sunpyramidstours.com/tour/giza-pyramids</loc>
    <lastmod>2026-05-01</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://sunpyramidstours.com/tour/giza-pyramids" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://sunpyramidstours.com/fr/tour/visite-pyramides-gizeh" />
    <xhtml:link rel="alternate" hreflang="de" href="https://sunpyramidstours.com/de/tour/gizeh-pyramiden" />
  </url>
</urlset>
```

## GET /sitemap-blog.xml — All Published Blog Posts

### Data Source

`GET https://sunpyramidtours.com/api/blogs?includes=seo,categories,translations&page_limit=500`

### URL Generation

- English: `https://sunpyramidstours.com/blog/{post.slug}`
- Non-English: `https://sunpyramidstours.com/{locale}/blog/{post.translations[locale].slug}`

### Filters Applied

- Same as tours (noindex, published, valid slug)

## GET /sitemap-categories.xml — Tour + Blog Categories

### Data Source

1. `GET https://sunpyramidtours.com/api/tour-categories?page_limit=100`
2. `GET https://sunpyramidtours.com/api/blog-categories?page_limit=100`

### URL Generation

- Tour categories (English): `https://sunpyramidstours.com/egypt-tours/{category.slug}`
- Tour categories (non-English): `https://sunpyramidstours.com/{locale}/egypt-tours/{category.slug}`
- Blog categories (English): `https://sunpyramidstours.com/egypt-travel-guide/{category.slug}`
- Blog categories (non-English): `https://sunpyramidstours.com/{locale}/egypt-travel-guide/{category.slug}`

### Filters Applied

- Category is active/has published content
- Category slug is valid and non-empty

## Cross-Cutting Rules

| Rule | Applies to |
|------|------------|
| All `<loc>` values use `https://sunpyramidstours.com` | All routes |
| Zero occurrences of `https://sunpyramidtours.com` (backend domain) | All routes |
| No `hreflang="en"` | All sub-sitemaps |
| No `/en/` path prefix in any URL | All routes |
| No `/ar/` path prefix in any URL | All routes |
| No `/checkout` path in any URL | All routes |
| XML well-formed and valid | All routes |
| Content-Type: `application/xml; charset=utf-8` | All routes |
| HTTP 200 even on empty result set | All sub-sitemaps |
| 30-second API timeout | All sub-sitemaps |
