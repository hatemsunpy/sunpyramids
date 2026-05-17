# Sun Pyramids Tours — SEO Rendering Fix Design

**Date:** 2026-04-30
**Status:** Draft — pending review
**Project:** Sun Pyramids Tours (sunpyramidstours.com)
**Stack:** Nuxt 3.15 SSR + Laravel API backend

---

## 1. Problem Statement

The website has a fully functional dashboard SEO section where SEO values are managed per language. The problem is **not** missing dashboard fields. The problem is that the frontend fails to correctly consume and render these dashboard SEO fields in the raw initial HTML served to crawlers.

Specific failures:

- `useSeo` composable has bugs (OG tags use `name` instead of `property`, meta keywords leak, hreflang hardcoded)
- Homepage SEO call is commented out
- Several page templates have no SEO fetch
- Schema is stored but not validated before rendering
- Prerendering is completely disabled (`routes: []`, `ignore: ["/*"]`)
- No dynamic sitemap exists
- Canonical/hreflang domain separation from backend domain is inconsistent

The goal: make existing dashboard-managed SEO data crawlable, server-rendered, valid, scalable, and multilingual — without hardcoding anything.

---

## 2. Current SEO Architecture Analysis

### 2.1 SSR Status

- `ssr: true` is already enabled in `nuxt.config.ts`
- Only `/checkout` has `ssr: false` via routeRules
- Prerender is entirely disabled: `crawlLinks: false`, `routes: []`, `ignore: ["/*"]`

### 2.2 Core SEO Flow (when working)

```
Page component → useApi().getData('pages/xyz?includes=seo')
→ page.seo object from API
→ addSeo(page) composable
→ useHead() → server-rendered <head> tags
```

### 2.3 Known Bugs in `composables/useSeo.js`

| Bug                                                             | Location                  | Impact                                            |
| --------------------------------------------------------------- | ------------------------- | ------------------------------------------------- |
| OG tags use `name` not `property`                               | Lines creating og:\* meta | Social crawlers ignore OG tags entirely           |
| `meta_keywords` included in `seo_meta_names` array              | Line 102 area             | Keywords leak into public HTML                    |
| Hreflang hardcoded for all 7 locales regardless of translations | Link array                | Incorrect hreflang for pages without translations |
| No `og:locale` tag generated                                    | Missing                   | Incomplete OG output                              |
| Schema only via `JSON.parse()` of dashboard field               | `pageStructureSchema()`   | No validation, no dynamic fallback                |

### 2.4 Pages With SEO vs Without

**Has SEO calls (good pattern):**

- `pages/contact-us.vue` — fetches `pages/contact-us?includes=seo`
- `pages/about-us.vue` — fetches `pages/about-us?includes=seo,metas`
- `pages/blog/[slug].vue` — fetches blog with `includes=seo,relatedTours`
- `components/MarktingPages/index.vue` — dynamic custom pages

**Missing/broken SEO calls:**

- `pages/index.vue` — SEO call **commented out entirely** (lines 50-57)
- `pages/egypt-tours/[slug].vue` — only renders `<MarktingPages />` (relies on child component)
- Tour category pages — needs audit
- Destination pages — needs audit
- Blog listing page — needs audit
- FAQ page — needs audit

### 2.5 Domain Map

| Purpose                                                | Domain                         |
| ------------------------------------------------------ | ------------------------------ |
| Public frontend (canonical, hreflang, sitemap, og:url) | `https://sunpyramidstours.com` |
| Backend API / dashboard                                | `https://sunpyramidtours.com`  |

baseURL in nuxt.config points to backend API domain: https://sunpyramidtours.com/api/ — this is correct if the backend is intentionally deployed there. Do not change it unless API calls are failing.

### 2.6 Fonts

Fonts are external files (TripSans family, 5 variants, `.woff2`/`.woff`/`.ttf`/`.eot`), all with `font-display: swap`. Not base64 inlined — no font-related SEO issue.

### 2.7 Arabic Status

Arabic (`/ar`) is NOT in the i18n config. No locale code, no route prefix, no translations. It must be excluded from hreflang, sitemap, and language switcher. If /ar URLs exist as legacy, do not include them in hreflang, sitemap, or language switcher. Do not implement redirects in this task unless requested separately.

---

## 3. Target SEO Architecture

### 3.1 End-to-End Flow

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Laravel       │     │ Nuxt SSR /   │     │ Fixed useSeo    │
│ Dashboard     │────▶│ Prerender    │────▶│ Composable      │
│ SEO fields    │     │ (useAsyncData│     │ + useHead()     │
│ per locale    │     │  or useFetch)│     │                 │
└──────────────┘     └──────────────┘     └────────┬────────┘
                                                    │
                    ┌───────────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────┐
│ Server-rendered HTML <head>                           │
│ ├─ <title> (dashboard Meta Title)                     │
│ ├─ <meta name="description"> (dashboard Meta Desc)    │
│ ├─ <meta name="robots"> (dashboard Robots)            │
│ ├─ <meta name="viewport"> (dashboard Viewport)        │
│ ├─ <meta property="og:title"> (dashboard OG Title)    │
│ ├─ <meta property="og:description">                   │
│ ├─ <meta property="og:image"> (dashboard OG Image)    │
│ ├─ <meta property="og:type"> (dashboard OG Type)      │
│ ├─ <meta property="og:url"> (canonical URL)           │
│ ├─ <meta property="og:locale"> (current locale)       │
│ ├─ <meta name="twitter:card"> (dashboard Twitter)     │
│ ├─ <meta name="twitter:creator">                      │
│ ├─ <meta name="twitter:image">                        │
│ ├─ <link rel="canonical"> (dashboard or dynamic)      │
│ ├─ <link rel="alternate" hreflang="x"> (dynamic)      │
│ ├─ <link rel="alternate" hreflang="x-default">        │
│ └─ <script type="application/ld+json"> (validated)    │
└──────────────────────────────────────────────────────┘
```

### 3.2 Key Design Decisions

1. **Hybrid rendering**: SSR for all pages + prerender critical routes (`/`, `/fr`, `/de`, etc.)
2. **Centralized composable**: Fix `useSeo.js` — all pages call `addSeo(data)` with dashboard + route context
3. **Schema generators**: New utility `utils/schema-generators.js` — only runs when dashboard `structure_schema` is empty
4. **Dynamic sitemap**: New server route `server/routes/sitemap.xml.ts` — pulls live data from API
5. **No hardcoding**: Every SEO value traces back to dashboard or real content data

---

## 4. Data Mapping — Dashboard Fields to HTML Output

| #   | Dashboard Field       | HTML Output                                   | Attribute | Fallback Chain                                                                     |
| --- | --------------------- | --------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| 1   | Meta Title            | `<title>`                                     | —         | page.title → page.name → "Sun Pyramids Tours"                                      |
| 2   | Meta Title            | `<meta property="og:title">`                  | property  | OG Title → Meta Title → page.title → "Sun Pyramids Tours"                          |
| 3   | Meta Title            | `<meta name="twitter:title">`                 | name      | Twitter Title → OG Title → Meta Title → page.title                                 |
| 4   | Meta Description      | `<meta name="description">`                   | name      | page.description → "Book your Egypt tour..."                                       |
| 5   | Meta Description      | `<meta property="og:description">`            | property  | OG Desc → Meta Desc → page.description                                             |
| 6   | Meta Description      | `<meta name="twitter:description">`           | name      | Twitter Desc → OG Desc → Meta Desc                                                 |
| 7   | Meta Keywords         | **NOT RENDERED**                              | —         | Dashboard field preserved, never output                                            |
| 8   | OpenGraph Title       | `<meta property="og:title">`                  | property  | Meta Title (see #2)                                                                |
| 9   | OpenGraph Description | `<meta property="og:description">`            | property  | Meta Description (see #5)                                                          |
| 10  | Canonical             | `<link rel="canonical">`                      | —         | Dynamic: `https://sunpyramidstours.com` + current route                            |
| 11  | Structure Schema      | `<script type="application/ld+json">`         | —         | Validated JSON-LD; if invalid → skip + warn; if empty → optional dynamic generator |
| 12  | Viewport              | `<meta name="viewport">`                      | name      | `width=device-width, initial-scale=1`                                              |
| 13  | Robots                | `<meta name="robots">`                        | name      | `index, follow`                                                                    |
| 14  | Open Graph Type       | `<meta property="og:type">`                   | property  | homepage→website, blog→article, tour→product                                       |
| 15  | Twitter Card          | `<meta name="twitter:card">`                  | name      | `summary_large_image`                                                              |
| 16  | Twitter Creator       | `<meta name="twitter:creator">`               | name      | Omit if empty                                                                      |
| 17  | Open Graph Image      | `<meta property="og:image">`                  | property  | OG Image → featured image → global default                                         |
| 18  | Twitter Image         | `<meta name="twitter:image">`                 | name      | Twitter Image → OG Image → featured → global default                               |
| 19  | — (generated)         | `<meta property="og:url">`                    | property  | Always = canonical URL (frontend domain)                                           |
| 20  | — (generated)         | `<meta property="og:locale">`                 | property  | Current locale ISO code                                                            |
| 21  | — (generated)         | `<link rel="alternate" hreflang="x">`         | —         | Dynamic, only for available translations                                           |
| 22  | — (generated)         | `<link rel="alternate" hreflang="x-default">` | —         | Points to English version                                                          |
| 23  | Language tabs         | Controls which locale's SEO fields load       | —         | Active locale determines dashboard field set                                       |

---

## 5. Implementation Plan — Sprint Breakdown

### Sprint 1: Audit & Architecture (Foundation)

**Goal:** Complete understanding of current state. No code changes yet.

Tasks:

- [ ] Inspect full SEO API response shape from dashboard (`pages/home?includes=seo`, etc.)
- [ ] Map exact field names returned by API (camelCase vs snake_case)
- [ ] Read current `useSeo.js` line-by-line, catalog every bug
- [ ] Audit all 20+ page templates for SEO call presence/absence
- [ ] Verify SSR/CSR split per route
- [ ] Check how `@nuxtjs/i18n` locale is accessed during SSR
- [ ] Check Cloudflare cache rules for HTML pages
- [ ] Document findings in audit notes (appendix to this design doc)

**Deliverable:** Audit document confirming/refining the bug list above.

### Sprint 2: Fix Centralized SEO Rendering (Core)

**Goal:** `useSeo.js` is correct and all pages use it. Every SEO tag renders in initial HTML.

Files to change:

- `composables/useSeo.js` — full fix
- `utils/seo.js` — add validation helpers, schema generators
- `pages/index.vue` — uncomment + fix SEO call
- All page templates missing SEO — add `addSeo()` call

Precise fixes for `useSeo.js`:

1. Replace `name: "og:*"` with `property: "og:*"` for all OG meta entries
2. Remove `meta_keywords` from rendered meta array
3. Generate hreflang dynamically from `supportedLocales` + available translations (not hardcoded 7)
4. Add `og:locale` tag
5. Add `og:url` = canonical
6. Add `twitter:title` and `twitter:description` fallbacks
7. Fix attribute map:
   - `name` → description, robots, viewport, twitter:card, twitter:title, twitter:description, twitter:image, twitter:creator
   - `property` → og:title, og:description, og:image, og:type, og:url, og:locale, og:site_name
8. Add canonical fallback: if empty → build from `https://sunpyramidstours.com` + current route
9. Add Structure Schema validation: `JSON.parse()` in try/catch, skip if invalid, warn in console
10. Ensure no duplicate tags

New file — `utils/seo.js` additions:

```javascript
// Schema validation
export const isValidJsonLd = (schemaString) => {
  if (!schemaString) return false;
  try {
    const parsed = JSON.parse(schemaString);
    return parsed && typeof parsed === "object" && parsed["@context"];
  } catch {
    return false;
  }
};

// Canonical URL builder
export const buildCanonicalUrl = (
  path,
  locale,
  appUrl = "https://sunpyramidstours.com",
) => {
  const cleanPath = path.replace(/\/$/, "") || "/";
  const prefix = locale && locale !== "en" ? `/${locale}` : "";
  return `${appUrl}${prefix}${cleanPath}`;
};
```

**Deliverable:** All pages render dashboard SEO in `<head>` via `useHead()` on server.

### Sprint 3: SSR, Hybrid Rendering & Prerendering

**Goal:** SEO data appears in raw HTML response without JavaScript execution.

Tasks:

- [ ] Confirm `ssr: true` in nuxt.config (already set)
- [ ] Enable prerendering for critical routes in `nitro.prerender.routes`:
  ```typescript
  prerender: {
    crawlLinks: true,
    routes: [
      '/',
      '/fr', '/de', '/it', '/pt', '/es', '/zh',
      '/about-us', '/fr/about-us', '/de/about-us', '/it/about-us', '/pt/about-us', '/es/about-us', '/zh/about-us',
      '/contact-us', '/fr/contact-us', '/de/contact-us', '/it/contact-us', '/pt/contact-us', '/es/contact-us', '/zh/contact-us',
      // Tour category pages (dynamic, fetched at build time)
      // Blog listing (dynamic, fetched at build time)
    ],
    ignore: ["/checkout", "/api/**"],
  }
  ```
- [ ] Ensure `useAsyncData` or `useFetch` is used (not `$fetch` alone) so data fetches happen server-side during SSR
- [ ] Verify prerendered HTML contains all SEO tags
- [ ] Document the rebuild process: "After dashboard SEO updates, run `npm run generate` and deploy"

Important: If pages are prerendered, dashboard SEO changes will not appear until the frontend is rebuilt/revalidated. If frequent dashboard SEO edits are expected, prefer SSR or ISR-style regeneration over static prerendering.

**Deliverable:** `curl https://sunpyramidstours.com/` shows full SEO tags in source.

### Sprint 4: Missing Pages & Multilingual SEO

**Goal:** Every page template loads locale-specific SEO from dashboard.

Pages to fix/add SEO to:

- [ ] `pages/index.vue` — uncomment, fix API call
- [ ] Tour detail pages (`pages/tour/[slug].vue` or equivalent)
- [ ] Tour category/destination pages
- [ ] Blog listing page
- [ ] FAQ page (if template exists)
- [ ] Any custom/landing page templates

Per-page pattern (consistent across all):

```javascript
const { getData } = useApi();
const { addSeo } = useSeo();
const route = useRoute();

const { data: pageData } = await useAsyncData(`seo-${route.path}`, () =>
  getData(`pages/${route.params.slug || route.name}?includes=seo`),
);

if (pageData.value) {
  addSeo(pageData.value, { route, locale: i18n.locale.value });
}
```

Hreflang must:

- [ ] Dynamically list only locales with actual translations
- [ ] Self-reference the current locale
- [ ] Point x-default to English
- [ ] Use `https://sunpyramidstours.com` domain
- [ ] Exclude Arabic

**Deliverable:** Every localized page renders correct, language-specific SEO.

### Sprint 5: Dynamic Sitemap

**Goal:** Sitemaps are generated from live data, not manually maintained.

New files:

- `server/routes/sitemap.xml.ts` — sitemap index
- `server/api/sitemap/pages.ts` or inline fetch
- Sitemap index structure:
  - `sitemap.xml` → index pointing to:
    - `sitemap-pages.xml` (static pages: home, about, contact, etc.)
    - `sitemap-tours.xml` (all published tours)
    - `sitemap-blog.xml` (all published blog posts)
    - `sitemap-categories.xml` (tour categories/destinations)

Rules:

- [ ] All URLs use `https://sunpyramidstours.com`
- [ ] Exclude: drafts, disabled tours, noindex pages, unsupported locales
- [ ] Exclude backend/dashboard URLs
- [ ] Use real `lastmod` from API when available
- [ ] Include `<xhtml:link rel="alternate" hreflang="...">` per URL if maintainable
- [ ] Validate XML output
- [ ] Each sitemap ≤ 50,000 URLs

**Deliverable:** `GET /sitemap.xml` returns valid XML with all indexable URLs.

### Sprint 6: Route Prefetch Performance Optimization

**Goal:** Reduce unnecessary homepage network activity by disabling Nuxt route prefetching on repeated heavy internal links while preserving crawlable links and normal navigation.

**Problem:** Chrome Network tab shows the homepage is automatically fetching many internal route documents as text/html before the user clicks them. Observed examples include tour routes (pyramids-nile-cruise-by-train, 2-day-white-desert-bahariya-fayoum-tour, from-cairo-6-days-package-to-el-fayoum-oasis, sharm-el-sheikh), blog routes, destination routes, category routes, and static pages (about-us, faq, all-blogs). Some text/html document requests take 5–10+ seconds (one tour route measured at ~10.14s). This is caused by Nuxt route prefetching from many NuxtLink components on the homepage, especially tour cards, blog cards, destination cards, category cards, related tours, and marketing cards.

**Important constraints:**

- Do NOT remove internal links
- Do NOT convert links to JavaScript-only click handlers
- Do NOT damage SEO crawlability
- Links must remain normal crawlable anchor links with valid href values
- The fix should only stop unnecessary route/document prefetching before user interaction

**Implementation approach — Option 1 (preferred, component-level fix):**

Add `no-prefetch` or `:prefetch="false"` to heavy NuxtLink card links:

```vue
<!-- Before -->
<NuxtLink :to="tourUrl">

<!-- After -->
<NuxtLink :to="tourUrl" no-prefetch>
<!-- or -->
<NuxtLink :to="tourUrl" :prefetch="false">
```

**Affected components to audit and fix:**

- TourCard
- FeaturedTourCard
- RelatedTourCard
- BlogCard
- DestinationCard
- CategoryCard
- MarketingPageCard
- Homepage tour sections
- Popular Destination section
- Blog preview section
- Any component rendering many NuxtLink cards on the same page

**Fallback — Option 2 (global fix, only if component-level is insufficient):**

Disable NuxtLink prefetch globally in nuxt.config, then selectively re-enable for critical lightweight navigation links:

```typescript
export default defineNuxtConfig({
  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },
});
```

Before choosing the global option, confirm it does not negatively affect important navigation UX.

**Technical requirements:**

1. Homepage should not automatically fetch every linked tour/blog/destination/category page as text/html
2. Internal links must remain real `<a href="">` links
3. Navigation must still work normally on click
4. SEO must not be affected negatively
5. Dashboard SEO behavior must not be changed
6. SSR/prerendering SEO fixes must remain intact
7. Do not remove sitemap or hreflang coverage
8. Do not lazy-render links in a way that hides them from crawlers

**Tasks:**

- [ ] Audit NuxtLink usage across homepage and card/listing components
- [ ] Identify components that render many links
- [ ] Add `no-prefetch` or `:prefetch="false"` to repeated heavy card links (tour cards, blog cards, destination cards, category cards, marketing cards)
- [ ] Keep normal prefetch for header/navigation if links are lightweight and important for UX
- [ ] Re-test Network tab using Doc/text-html filter
- [ ] Confirm homepage no longer fetches many internal route documents on initial load
- [ ] Document before/after screenshots and metrics (total requests, transferred size, LCP, TBT)

**Acceptance criteria:**

- [ ] Open Chrome DevTools → Network → filter by Doc or text/html
- [ ] Load homepage with cache disabled
- [ ] Before clicking anything, the browser should NOT load dozens of internal route documents
- [ ] Internal tour/blog/destination/category text/html requests happen only when user clicks a link (or only for a very small approved set of critical links)
- [ ] The previous example request taking ~10.14s should no longer be automatically triggered on homepage load
- [ ] Tour cards still navigate correctly when clicked
- [ ] Blog cards still navigate correctly when clicked
- [ ] Destination/category cards still navigate correctly when clicked
- [ ] Links remain crawlable and visible in the rendered HTML
- [ ] Lighthouse performance and total network requests should improve
- [ ] LCP and main-thread/network pressure should improve or at least not worsen

**Testing checklist:**

- [ ] Open homepage in Chrome Incognito
- [ ] Open DevTools → Network → Enable "Disable cache" → Filter by Doc
- [ ] Reload homepage → confirm only the main homepage document loads initially
- [ ] Confirm internal tour/blog/category pages are not fetched automatically
- [ ] Click one tour card → confirm that specific tour document loads only after click
- [ ] Repeat for blog and destination links
- [ ] Run Lighthouse before and after → compare total requests, transferred size, LCP, and TBT
- [ ] Confirm no SEO tags were removed from raw HTML
- [ ] Confirm links still appear as normal anchor href links

**Deliverable:** Homepage no longer preloads many internal tour/blog/destination/category HTML documents before user interaction, while all links remain crawlable and clickable.

### Sprint 7: QA, Validation & Deployment

**Goal:** Every acceptance criterion passes before production deploy.

Tasks:

- [ ] Run all curl tests from Acceptance Criteria section
- [ ] Google Rich Results Test — valid schema detected
- [ ] Facebook Sharing Debugger — correct OG: image, title, description
- [ ] Schema.org Validator — clean
- [ ] `sitemap.xml` XML validation
- [ ] Hreflang audit: only supported languages, correct domains
- [ ] Confirm meta keywords NOT in public HTML
- [ ] Confirm no hardcoded SEO values in any `.vue` file
- [ ] Confirm backend domain NOT in canonical/hreflang/sitemap/og:url
- [ ] Confirm backend domain IS used for API calls where intended
- [ ] Cloudflare: purge cache post-deploy
- [ ] Google Search Console: submit sitemap, monitor for errors
- [ ] Lighthouse audit
- [ ] Save before/after curl outputs for comparison

**Deliverable:** Signed-off production deployment.

---

## 6. Code-Level Change List

### Files to Modify

| File                                   | Change                                                                                                                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `composables/useSeo.js`                | **Major rewrite** — fix OG property, remove keywords, dynamic hreflang, fallback chain, schema validation, canonical fallback, duplicate prevention |
| `utils/seo.js`                         | **Expand** — add `isValidJsonLd()`, `buildCanonicalUrl()`, `generateHreflang()`, optional schema generators                                         |
| `pages/index.vue`                      | **Uncomment + fix** SEO call                                                                                                                        |
| `pages/tour/[slug].vue` or tour detail | **Add** centralized SEO call (if missing)                                                                                                           |
| `pages/egypt-tours/[slug].vue`         | **Add** SEO call directly or ensure child handles it                                                                                                |
| Tour category/destination pages        | **Add** SEO call per template                                                                                                                       |
| Blog listing page                      | **Add** SEO call                                                                                                                                    |
| FAQ page template                      | **Add** SEO call (if exists)                                                                                                                        |
| All page templates with missing SEO    | **Add** consistent `addSeo()` pattern                                                                                                               |
| `nuxt.config.ts`                       | **Fix** baseURL typo, **enable** prerender routes, **add** routeRules for critical pages, **optionally** disable NuxtLink prefetch globally         |
| Card/listing components (TourCard,     | **Add** `no-prefetch` or `:prefetch="false"` to NuxtLink elements to stop automatic route document prefetching on homepage                          |
| FeaturedTourCard, RelatedTourCard,     |                                                                                                                                                     |
| BlogCard, DestinationCard,             |                                                                                                                                                     |
| CategoryCard, MarketingPageCard, etc.) |                                                                                                                                                     |

### Files to Create

| File                                    | Purpose                                                                                                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/routes/sitemap.xml.ts`          | Dynamic sitemap index                                                                                                                                                         |
| `utils/schema-generators.js` (optional) | Dynamic schema fallback generators (Organization, LocalBusiness, BreadcrumbList, Tour/Product, FAQPage, BlogPosting) — only active when dashboard `structure_schema` is empty |

### Files to NOT Touch

- Dashboard/backend SEO section (Laravel)
- `redirect-rules.js` (existing redirects preserved)
- `server/middleware/redirect-http-protocol.ts` (existing middleware preserved)
- `i18n/Helpers/config.js` (locale list preserved)
- `assets/fonts/font.scss` (fonts already correct)
- `stores/sharedStore.js` (unrelated to SEO rendering)

---

## 7. Acceptance Criteria

- [ ] **AC-01**: `curl https://sunpyramidstours.com/` shows `<title>` from dashboard Meta Title
- [ ] **AC-02**: Raw HTML contains `<meta name="description">` from dashboard Meta Description
- [ ] **AC-03**: `<link rel="canonical">` uses `https://sunpyramidstours.com` domain
- [ ] **AC-04**: All OG tags use `property=""` attribute (not `name`)
- [ ] **AC-05**: OG tags include: `og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:locale`, `og:site_name`
- [ ] **AC-06**: Twitter tags include: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- [ ] **AC-07**: `<meta name="keywords">` is NOT present in any public page source
- [ ] **AC-08**: Valid dashboard `structure_schema` renders as `<script type="application/ld+json">` in initial HTML
- [ ] **AC-09**: Invalid `structure_schema` does NOT render, does NOT break the page
- [ ] **AC-10**: Every page (home, tour, category, blog, contact, about) loads SEO from dashboard/API
- [ ] **AC-11**: Hreflang tags are dynamic, only list available translations, use frontend domain
- [ ] **AC-12**: `x-default` hreflang points to English version
- [ ] **AC-13**: Arabic (`/ar`) is excluded from hreflang, sitemap, and language switcher
- [ ] **AC-14**: `GET /sitemap.xml` returns valid XML, frontend domain, only indexable pages
- [ ] **AC-15**: No hardcoded SEO static values in any `.vue` page component
- [ ] **AC-16**: Backend domain `sunpyramidtours.com` NOT present in canonical, hreflang, og:url, or sitemap URLs
- [ ] **AC-17**: Backend domain IS still used for API/dashboard requests
- [ ] **AC-18**: No trailing-slash locale redirects added
- [ ] **AC-19**: Facebook Sharing Debugger shows correct OG data
- [ ] **AC-20**: Google Rich Results Test detects valid schema (where dashboard provides it)
- [ ] **AC-21**: All 7 supported locales render locale-specific SEO (en, fr, de, it, pt, es, zh)
- [ ] **AC-22**: No duplicate meta tags (single canonical, single robots, single description)
- [ ] **AC-23**: Lighthouse SEO score improves from baseline
- [ ] **AC-24**: Prerendered or SSR HTML contains SEO tags (no JS-required SEO for critical routes)
- [ ] **AC-25**: Homepage does NOT automatically prefetch internal tour/blog/destination/category HTML documents on load (Doc/text-html filter shows only the main document)
- [ ] **AC-26**: All card/tour/blog/destination links remain crawlable `<a href="">` elements in rendered HTML — no JS-only click handlers

---

## 8. Testing Checklist

### Browser-Based (Network Tab — Prefetch Audit)

1. Open homepage in Chrome Incognito
2. Open DevTools → Network → Enable "Disable cache" → Filter by Doc
3. Reload homepage → confirm only the main homepage document loads initially
4. Confirm internal tour/blog/category pages are NOT fetched automatically
5. Click one tour card → confirm that specific tour document loads only after click
6. Repeat for blog and destination links
7. Run Lighthouse before and after → compare total requests, transferred size, LCP, and TBT
8. Confirm no SEO tags were removed from raw HTML
9. Confirm links still appear as normal anchor href links

### Automated (curl-based)

```bash
# 1. Homepage SEO presence
curl -s https://sunpyramidstours.com/ | grep -c "<title>"           # Expected: 1
curl -s https://sunpyramidstours.com/ | grep -c "og:title"         # Expected: 1
curl -s https://sunpyramidstours.com/ | grep -c "twitter:card"     # Expected: 1

# 2. Keywords absence
curl -s https://sunpyramidstours.com/ | grep -i "keywords"         # Expected: 0 matches for meta keywords

# 3. Domain correctness
curl -s https://sunpyramidstours.com/ | grep "canonical" | grep "sunpyramidstours.com"    # Expected: match
curl -s https://sunpyramidstours.com/ | grep "canonical" | grep "sunpyramidtours.com"     # Expected: NO match
curl -s https://sunpyramidstours.com/ | grep "hreflang" | grep "sunpyramidtours.com"      # Expected: NO match

# 4. Schema rendering
curl -s https://sunpyramidstours.com/ | grep "application/ld+json"

# 5. Locale pages
curl -s https://sunpyramidstours.com/fr | grep "canonical" | grep "/fr"
curl -s https://sunpyramidstours.com/de | grep "hreflang"

# 6. Sitemap
curl -s https://sunpyramidstours.com/sitemap.xml | head -20

# 7. Social crawler simulation
curl -s https://sunpyramidstours.com/ | grep "og:image"
curl -s https://sunpyramidstours.com/ | grep "twitter:image"
```

### External Tools

- [ ] Google Rich Results Test (https://search.google.com/test/rich-results)
- [ ] Schema.org Validator (https://validator.schema.org/)
- [ ] Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/)
- [ ] Twitter Card Validator (https://cards-dev.twitter.com/validator)
- [ ] Google PageSpeed Insights
- [ ] Lighthouse (SEO category)
- [ ] Ahrefs or Screaming Frog crawl
- [ ] XML Sitemap Validator
- [ ] Google Search Console — sitemap submission, index coverage, hreflang reports

---

## 9. Rollback Plan

### Before Changes

1. Create dedicated branch: `fix/seo-rendering`
2. Save baseline `curl` output for all critical pages:
   ```bash
   curl -s https://sunpyramidstours.com/ > /tmp/seo-before-home.html
   curl -s https://sunpyramidstours.com/fr > /tmp/seo-before-fr.html
   curl -s https://sunpyramidstours.com/sitemap.xml > /tmp/seo-before-sitemap.xml
   ```
3. Take screenshot of Google Search Console current state

### Deployment

1. Deploy to staging environment first
2. Run full curl test suite on staging
3. Compare before/after raw HTML
4. Deploy to production only after staging passes all ACs

### If Rollback Needed

**Triggers:**

- Booking flow breaks
- Forms stop working
- Tour pages fail to render
- API requests fail (500 errors)
- Dashboard SEO data loads incorrectly or not at all
- Core Web Vitals degrade significantly

**Rollback steps:**

1. Redeploy previous production build
2. Purge Cloudflare cache (Everything)
3. Verify site functions with curl
4. Monitor Search Console for 48h
5. Investigate root cause on staging before re-attempting

**Partial rollback options:**

- If SSR causes load issues → disable prerendering, keep SSR only
- If schema validation errors → skip invalid schema rendering (log warnings), keep valid ones
- If sitemap has issues → keep old static sitemap, fix dynamic one on staging

---

## 10. Out of Scope (Explicitly)

- Rebuilding the dashboard SEO section
- Adding new dashboard SEO fields
- Removing dashboard SEO fields
- Hardcoding SEO values in Nuxt pages
- Static schema injection in components
- Fake reviews, ratings, prices, availability, or business data
- Trailing-slash locale redirects (`/fr/` → `/fr`)
- Blind replacement of all `sunpyramidtours.com` → `sunpyramidstours.com`
- Adding Arabic (`/ar`) support
- Font inlining changes

---

## Appendix A — OG/Twitter Attribute Map (Reference)

| Tag                   | Attribute  | Example                                                    |
| --------------------- | ---------- | ---------------------------------------------------------- |
| `description`         | `name`     | `<meta name="description" content="...">`                  |
| `robots`              | `name`     | `<meta name="robots" content="index, follow">`             |
| `viewport`            | `name`     | `<meta name="viewport" content="...">`                     |
| `og:title`            | `property` | `<meta property="og:title" content="...">`                 |
| `og:description`      | `property` | `<meta property="og:description" content="...">`           |
| `og:image`            | `property` | `<meta property="og:image" content="...">`                 |
| `og:type`             | `property` | `<meta property="og:type" content="website">`              |
| `og:url`              | `property` | `<meta property="og:url" content="...">`                   |
| `og:locale`           | `property` | `<meta property="og:locale" content="en_US">`              |
| `og:site_name`        | `property` | `<meta property="og:site_name" content="...">`             |
| `twitter:card`        | `name`     | `<meta name="twitter:card" content="summary_large_image">` |
| `twitter:title`       | `name`     | `<meta name="twitter:title" content="...">`                |
| `twitter:description` | `name`     | `<meta name="twitter:description" content="...">`          |
| `twitter:image`       | `name`     | `<meta name="twitter:image" content="...">`                |
| `twitter:creator`     | `name`     | `<meta name="twitter:creator" content="@...">`             |

---

## Appendix B — Supported Locales Reference

| Code | Name      | ISO     | Hreflang |
| ---- | --------- | ------- | -------- |
| `en` | English   | `en-US` | `en`     |
| `fr` | Français  | `fr-FR` | `fr`     |
| `de` | Deutsch   | `de-DE` | `de`     |
| `it` | Italiano  | `it-IT` | `it`     |
| `pt` | Português | `pt-PT` | `pt`     |
| `es` | Español   | `es-ES` | `es`     |
| `zh` | 简体中文  | `zh-CN` | `zh`     |

x-default: `en`

---

_Next: Spec self-review → User review → Transition to writing-plans_
