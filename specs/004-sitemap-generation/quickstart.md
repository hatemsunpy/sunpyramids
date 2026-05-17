# Quickstart: Dynamic Sitemap Generation

**Feature**: 004-sitemap-generation | **Date**: 2026-05-10

## Prerequisites

- Phase 1-3 SEO fixes applied (branch `003-page-ssr-seo-fixes` merged or cherry-picked)
- Dev server running: `npm run dev`
- API backend accessible at `https://sunpyramidtours.com/api/`
- XML validation tool: `xmllint` (recommended) or online validator at `https://www.xml-sitemaps.com/validate-xml-sitemap.html`

## Quick Validation (After Implementation)

### Step 1: Verify sitemap index is reachable

```bash
curl -s http://localhost:3000/sitemap.xml
```

Expected: Valid XML sitemap index with 4 `<sitemap>` entries.

### Step 2: Validate XML of each sub-sitemap

```bash
# Basic curl check
for path in sitemap-pages.xml sitemap-tours.xml sitemap-blog.xml sitemap-categories.xml; do
  echo "=== $path ==="
  curl -s -o /dev/null -w "%{http_code} %{content_type}" http://localhost:3000/$path
  echo ""
done
```

Expected: All 4 return `200 application/xml; charset=utf-8`.

### Step 3: Run exclusion rule checks

```bash
# Check no backend domain leaks
curl -s http://localhost:3000/sitemap.xml | grep -c "sunpyramidtours.com"  # Must be 0
curl -s http://localhost:3000/sitemap-tours.xml | grep -c "sunpyramidtours.com"  # Must be 0

# Check no Arabic locale
curl -s http://localhost:3000/sitemap-tours.xml | grep -c "/ar/"  # Must be 0

# Check no /en/ prefix
curl -s http://localhost:3000/sitemap-pages.xml | grep -oP 'loc>\K[^<]*/en/' | wc -l  # Must be 0

# Check no checkout URLs
curl -s http://localhost:3000/sitemap-pages.xml | grep -c "checkout"  # Must be 0
```

### Step 4: Verify hreflang structure

```bash
# Check hreflang alternates present
curl -s http://localhost:3000/sitemap-tours.xml | grep -c "xhtml:link"  # Should be > 0

# Check no hreflang="en"
curl -s http://localhost:3000/sitemap-tours.xml | grep 'hreflang="en"'  # Must be empty

# Check x-default present
curl -s http://localhost:3000/sitemap-tours.xml | grep -c 'hreflang="x-default"'  # Must be > 0
```

### Step 5: Cross-locale verification

```bash
# Verify all 7 supported locales appear as hreflang values
for locale in fr de it pt es zh; do
  count=$(curl -s http://localhost:3000/sitemap-tours.xml | grep -c "hreflang=\"$locale\"")
  echo "$locale: $count hreflang entries"
done
```

### Step 6: Verify static file is not served

```bash
# After deleting public/sitemap.xml, the route should still respond
curl -s http://localhost:3000/sitemap.xml | head -1
# Expected: <?xml version="1.0" encoding="UTF-8"?>
```

### Step 7: XML schema validation

```bash
# With xmllint installed
curl -s http://localhost:3000/sitemap.xml | xmllint --format -
for path in sitemap-pages.xml sitemap-tours.xml sitemap-blog.xml sitemap-categories.xml; do
  echo "--- $path ---"
  curl -s http://localhost:3000/$path | xmllint --noout --valid -
done
```

### Step 8: API failure resilience

```bash
# Disconnect from API and verify graceful degradation
# (This requires temporarily blocking the API host or mocking a 500)
# Expected: sub-sitemaps return empty <urlset>, sitemap index still 200
```

## Key Files

| File | Purpose |
|------|---------|
| `server/routes/sitemap.xml.ts` | Sitemap index — hardcoded XML, no API calls |
| `server/routes/sitemap-pages.xml.ts` | Pages sub-sitemap — fetches static + marketing pages from API |
| `server/routes/sitemap-tours.xml.ts` | Tours sub-sitemap — fetches all published tours |
| `server/routes/sitemap-blog.xml.ts` | Blog sub-sitemap — fetches all published blog posts |
| `server/routes/sitemap-categories.xml.ts` | Categories sub-sitemap — fetches tour + blog categories |
| `public/sitemap.xml` | **DELETE** — replaced by dynamic route |

## Common Issues

1. **Route not found (404)**: Server routes must be under `server/routes/` (not `server/api/`). Nitro auto-registers `.ts` files as route handlers.

2. **Static file still served**: Delete `public/sitemap.xml`. In Nuxt 3 dev mode, the public directory may take precedence.

3. **API connection refused**: Confirm the Laravel API is running and accessible. Check `nuxt.config.ts` proxy/api configuration.

4. **XML parsing errors**: Ensure all URLs are properly escaped. Use `encodeXML` helper or manual `.replace()` for `&`, `<`, `>`, `"`, `'`.

5. **Missing hreflang for some locales**: Not all content has all 7 translations. Only include hreflang entries for locales where translations exist — never generate empty or placeholder hreflangs.
