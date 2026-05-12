# Quickstart: Page-Level SSR SEO Fixes

**Feature**: 003-page-ssr-seo-fixes | **Date**: 2026-05-04

## Prerequisites

1. Phase 2 foundational fixes applied and verified (hreflang, OG/Twitter attributes, meta keywords, schema safety, X-Localize)
2. Dev server running: `npm run dev`
3. All 7 locales accessible: `/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`

## The Fix Pattern

All broken pages follow the same two anti-patterns. Here's how to fix each.

### Anti-Pattern A: Async Wrapper Without Await (6 pages)

**What it looks like**:
```js
const getPageData = async () => {
  await getData('pages/some-page?includes=seo').then((res) => {
    pageData.value = res.data
    addSeo(pageData.value)
  })
}
getPageData()  // ← NOT awaited! SSR doesn't wait.
```

**Fix** — remove wrapper, use top-level await:
```js
pageData.value = await getData('pages/some-page?includes=seo').then((res) => {
  return res.data
})
addSeo(pageData.value)
```

### Anti-Pattern B: Commented Out (1 page — homepage)

**What it looks like**: Lines 50-57 in `pages/index.vue` — SEO block commented out.

**Fix**: Uncomment and align to correct pattern.

### Reference: Correct Pattern (faqs.vue, blogs/all-blogs.vue)

```js
const { getData } = useApi()
const { addSeo } = useSeo()

const pageData = ref(null)
pageData.value = await getData("pages/some-page?includes=seo").then((res) => {
  return res.data
})
addSeo(pageData.value)
```

## Pages To Fix

### Phase A: P1 — SSR Blocking Fixes (7 pages)

| # | File | Anti-Pattern | Fix |
|---|------|:---:|-----|
| 1 | `pages/index.vue` | B (commented out) | Uncomment lines 50-57, adapt to reference pattern |
| 2 | `pages/contact-us.vue` | A (wrapper without await, line 32) | Remove `getContactData` wrapper, top-level await |
| 3 | `pages/about-us.vue` | A (wrapper without await, line 51) | Remove `getAboutData` wrapper, top-level await |
| 4 | `pages/egypt-travel-guide/index.vue` | A (wrapper without await, line 25) + inner getData also un-awaited (line 19) | Remove `getPlogPage` wrapper, add `await` to inner getData |
| 5 | `pages/egypt-tours/nile-cruises/index.vue` | A (wrapper without await, line 30) | Remove `getNileDate` wrapper, top-level await |
| 6 | `pages/egypt-tours/shore-excursions/index.vue` | A (wrapper without await, line 29) | Remove `getShoreDate` wrapper, top-level await |
| 7 | `pages/egypt-travel-guide/[cate]/index.vue` | A (wrapper without await, line 38) | Remove `getPage` wrapper, top-level await |

### Phase B: P2 — Simplify Working-but-Fragile (1 page)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 8 | `pages/tour/[id].vue` | addSeo inside `watch(..., { immediate: true })` — works but fragile | Replace watcher with direct `addSeo(tour.value)` after top-level await |

### Phase C: P2 — Prefetch Control

| # | File | Change |
|---|------|--------|
| 9 | `nuxt.config.ts` | Add `experimental: { defaults: { nuxtLink: { prefetch: false } } }` |

### Phase D: P2 — Error Boundary (all fixed pages)

Add try/catch around the `getData()` call in each of the 7 fixed pages:

```js
try {
  pageData.value = await getData('pages/some-page?includes=seo').then((res) => {
    return res.data
  })
  addSeo(pageData.value)
} catch (err) {
  console.warn('[SEO] Failed to fetch SEO data for some-page:', err.message)
  addSeo({ meta_title: 'Sun Pyramids Tours' })
}
```

## Verification Procedure

### Step 1: Per-Page SSR Verification

For each fixed page, run:
```bash
curl -s http://localhost:3000/<page-path> | grep -E '<title>|<meta name="description"|<meta property="og:title"|<meta name="twitter:title"|<link rel="canonical"|<link rel="alternate"|<script type="application/ld+json"'
```

Expected: All 7 tag types present in output.

### Step 2: Homepage SEO

```bash
curl -s http://localhost:3000/ | grep '<title>'
```
Expected: Title from Home dashboard entry (not empty, not "Sun Pyramids Tours" fallback unless API fails).

### Step 3: OG Attribute Correctness (GATE-02 from Phase 2)

```bash
curl -s http://localhost:3000/<page-path> | grep 'og:' | grep 'name="og:'
```
Expected: Empty (no matches). All OG tags use `property=""`.

### Step 4: Meta Keywords Absent (GATE-03 from Phase 2)

```bash
curl -s http://localhost:3000/<page-path> | grep -i 'keywords'
```
Expected: Empty (no matches).

### Step 5: Error Resilience

Simulate API failure (stop Laravel API or mock a 500 response):
```bash
curl -s http://localhost:3000/contact-us
```
Expected: Status 200, page renders, `<title>Sun Pyramids Tours</title>` fallback present.

### Step 6: Prefetch Verification (GATE-10)

1. Open browser DevTools → Network tab
2. Load homepage `http://localhost:3000/`
3. Filter for `text/html` documents
4. Expected: Only one document (the homepage) fetched on initial load. No tour detail pages, blog pages, or category pages fetched automatically.
5. Hover over a header nav link → observe if target page prefetches (depends on whether header re-enable was needed).

### Step 7: Link Crawlability (GATE-11)

```bash
curl -s http://localhost:3000/ | grep -oP '<a\s+[^>]*href="[^"]*"' | head -20
```
Expected: Multiple `<a href="...">` elements. Cards have real links.

### Step 8: Cross-Locale Verification (SC-007)

```bash
for locale in '' /fr /de /it /pt /es /zh; do
  echo "=== $locale ==="
  curl -s "http://localhost:3000${locale}" | grep '<title>'
done
```
Expected: Each locale returns a distinct title in the correct language.

## Expected Failures (before fixes applied)

These pages will FAIL verification before their fixes:
- `/` (homepage): No SEO tags (commented out)
- `/contact-us`: No SEO tags (fire-and-forget async wrapper)
- `/about-us`: No SEO tags (fire-and-forget async wrapper)
- `/egypt-travel-guide`: No SEO tags (fire-and-forget + inner getData un-awaited)
- `/egypt-tours/nile-cruises`: No SEO tags (fire-and-forget)
- `/egypt-tours/shore-excursions`: No SEO tags (fire-and-forget)
- `/egypt-travel-guide/some-category`: No SEO tags (fire-and-forget)

These pages should PASS verification before any fixes (already correct):
- `/faqs`
- `/blogs/all-blogs`
- `/blog/some-slug`
- `/egypt-tours/one-day-tours`
- `/egypt-tours/multi-days-tours`
- `/tour/some-id`: Passes but via watcher (fragile)
