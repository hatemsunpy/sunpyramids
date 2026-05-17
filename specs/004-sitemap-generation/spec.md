# Feature Specification: Dynamic Sitemap Generation

**Feature Branch**: `004-sitemap-generation`
**Created**: 2026-05-06
**Status**: Draft
**Input**: User description: "phase 4"

## Clarifications

### Session 2026-05-06

- Q: How are custom marketing pages discovered for the sitemap? → A: Custom marketing pages must be discovered dynamically from the dashboard/API. The sitemap must include all published, indexable marketing pages and exclude drafts, disabled, noindex, unsupported-locale, and backend/dashboard URLs. Do not hardcode marketing page slugs.
- Q: What timeout should each sitemap sub-route apply to its API calls? → A: 30 seconds — same as Phase 3 page-level SEO timeout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search Engines Discover All Indexable Pages Via Sitemap (Priority: P1)

When a search engine crawler requests the sitemap, it receives a sitemap index pointing to sub-sitemaps for each content type (pages, tours, blogs, categories). Each sub-sitemap lists all published, indexable URLs for that content type across all supported languages, with proper hreflang alternates. Currently, a large static file is served — it drifts out of sync with live content and does not follow the sitemap index + sub-sitemap structure.

**Why this priority**: Sitemaps are the primary discovery mechanism for search engines. Without an accurate, structured sitemap, search engines may miss pages, index stale URLs, or fail to understand the site's full content scope. This directly impacts indexed page count and crawl budget allocation.

**Independent Test**: Request `/sitemap.xml` and confirm it returns a valid sitemap index XML with `<sitemap>` entries for pages, tours, blogs, and categories. Follow each sub-sitemap URL and confirm it lists valid URLs with correct hreflang alternates.

**Acceptance Scenarios**:

1. **Given** a crawler requests `/sitemap.xml`, **When** the server responds, **Then** the response is a valid XML sitemap index containing `<sitemap>` entries for pages, tours, blogs, and categories — each with a `<loc>` and `<lastmod>`.
2. **Given** a crawler requests `/sitemap-tours.xml`, **When** the server responds, **Then** the response contains `<url>` entries for every published tour across all supported languages, each with `<loc>` and `<lastmod>`, and hreflang alternates via `<xhtml:link>`.
3. **Given** a crawler requests `/sitemap-blog.xml`, **When** the server responds, **Then** the response contains `<url>` entries for every published blog post across all supported languages with hreflang alternates.
4. **Given** a crawler requests `/sitemap-pages.xml`, **When** the server responds, **Then** the response contains `<url>` entries for all static pages (homepage, about-us, contact-us, faqs, privacy, terms, egypt-travel-guide, and any active marketing pages) across all supported languages.
5. **Given** a crawler requests `/sitemap-categories.xml`, **When** the server responds, **Then** the response contains `<url>` entries for all active tour categories and blog categories across all supported languages.

---

### User Story 2 - Sitemap Reflects Current Content, Not Stale Snapshot (Priority: P1)

When content changes (new tours published, blog posts added, pages updated, translations enabled/disabled), the sitemap must reflect those changes without manual intervention. Currently, a static file requires manual regeneration whenever content changes.

**Why this priority**: A stale sitemap causes search engines to miss new content, waste crawl budget on removed pages, and index outdated URLs. The sitemap must be generated live from the API so it always matches the current content state.

**Independent Test**: Publish a new tour via the dashboard, then request the sitemap — the new tour appears. Disable a tour, then request the sitemap — the disabled tour is absent.

**Acceptance Scenarios**:

1. **Given** a new tour is published via the dashboard, **When** a crawler next requests `/sitemap-tours.xml`, **Then** the new tour appears with its correct URL and hreflang alternates.
2. **Given** a blog post is unpublished or marked noindex, **When** a crawler requests `/sitemap-blog.xml`, **Then** that blog post is absent from the sitemap.
3. **Given** a page's translation for a specific locale is disabled, **When** a crawler requests the relevant sub-sitemap, **Then** URLs for that locale are absent from that page's hreflang alternates.

---

### User Story 3 - Sitemap Excludes Non-Indexable Content (Priority: P2)

Pages, tours, and blog posts that are not meant for search engines must be excluded from the sitemap. This includes: pages with robots noindex, disabled/draft content, the checkout page (which requires client-side rendering), and unsupported locales like Arabic.

**Why this priority**: Including non-indexable URLs in the sitemap wastes crawl budget and sends conflicting signals to search engines (sitemap says "index this" but robots meta says "noindex"). Excluding them keeps the sitemap clean and crawl-efficient.

**Independent Test**: Verify that `/ar` URLs, checkout URLs, disabled tours, and noindex-marked pages are absent from all sitemap responses.

**Acceptance Scenarios**:

1. **Given** a tour has `robots: noindex` in its SEO settings, **When** the sitemap is generated, **Then** that tour is absent from `/sitemap-tours.xml`.
2. **Given** the `/checkout` page is configured as client-side only, **When** the sitemap is generated, **Then** no checkout URL appears in any sitemap.
3. **Given** Arabic (`/ar`) is not in the supported locales list, **When** the sitemap is generated, **Then** no `/ar/` URL appears anywhere in the sitemap.

---

### Edge Cases

- What happens when a sub-sitemap API endpoint returns a 500 error? That sub-sitemap should return an empty `<urlset>` or be omitted from the index — the sitemap index itself must still render and point to the other sub-sitemaps that did succeed.
- What happens when a content type has zero published items (e.g., no blog posts yet)? The sub-sitemap should return an empty `<urlset>` (valid but empty) rather than a 404 or 500 error.
- What happens when a sub-sitemap exceeds 50,000 URLs? For this site's scale, no sub-sitemap will reach 50,000 URLs. If it ever does, the system should split into numbered sub-sitemaps (e.g., `sitemap-tours-1.xml`, `sitemap-tours-2.xml`).
- What happens when the API responds slowly (e.g., 10+ seconds)? The sitemap route must apply a 30-second timeout per API call. If the API times out, the sub-sitemap returns an empty `<urlset>` rather than hanging the crawler's request.
- What happens when a URL contains special characters (e.g., tour names with `&` or quotes)? URLs in the sitemap must be properly XML-escaped.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `/sitemap.xml` route MUST return a valid XML sitemap index that references at minimum these sub-sitemaps: `sitemap-pages.xml`, `sitemap-tours.xml`, `sitemap-blog.xml`, `sitemap-categories.xml`.
- **FR-002**: The `/sitemap-pages.xml` route MUST return a valid XML urlset containing all static public pages (homepage, about-us, contact-us, faqs, privacy-and-cookies, terms-and-conditions, sustainability, accessible-travel, egypt-travel-guide index) plus all published, indexable custom marketing pages discovered dynamically from the dashboard/API — across all supported locales, with hreflang alternates. Marketing page slugs MUST NOT be hardcoded.
- **FR-003**: The `/sitemap-tours.xml` route MUST return a valid XML urlset containing all published, indexable tours across all supported locales, with hreflang alternates. Source: live API data.
- **FR-004**: The `/sitemap-blog.xml` route MUST return a valid XML urlset containing all published, indexable blog posts across all supported locales, with hreflang alternates. Source: live API data.
- **FR-005**: The `/sitemap-categories.xml` route MUST return a valid XML urlset containing all active tour categories and blog categories across all supported locales, with hreflang alternates. Source: live API data.
- **FR-006**: Every `<loc>` URL in every sitemap MUST use the frontend domain `https://sunpyramidstours.com`. The backend/API domain (`https://sunpyramidtours.com`) MUST NOT appear in any sitemap URL.
- **FR-007**: English URLs MUST NOT include an `/en` path prefix. The x-default hreflang MUST point to the English (root-path) URL.
- **FR-008**: The sitemap MUST exclude: pages/tours/blogs marked `robots: noindex`, disabled/draft content, the `/checkout` page, the Arabic (`/ar`) locale, and any locale not in the supported 7-language set (en, fr, de, it, pt, es, zh).
- **FR-009**: Each `<url>` entry in sub-sitemaps MUST include `<lastmod>` in `YYYY-MM-DD` format reflecting the content's last modification date (from API data). If unavailable, use the current date.
- **FR-010**: All sitemap XML MUST be well-formed, UTF-8 encoded, and valid against the sitemaps.org XML schema.
- **FR-011**: The `public/sitemap.xml` static file MUST be removed or replaced by the dynamic route. The old static file MUST NOT be served once the dynamic implementation is active.

### Key Entities

- **SitemapIndex**: The top-level sitemap listing sub-sitemaps. Contains metadata for each sub-sitemap: location URL and last modification date. Serves as the entry point for crawler discovery.
- **SubSitemap**: A content-type-specific sitemap (pages, tours, blogs, categories). Contains a list of URLs with their last modification dates and hreflang alternates pointing to translated versions.
- **SitemapURLEntry**: A single URL in a sub-sitemap. Includes: the canonical page URL (`<loc>`), last modification date (`<lastmod>`), and for each available translation, an `<xhtml:link>` with `rel="alternate"` and the appropriate `hreflang` attribute.
- **ExclusionRule**: Criteria for omitting a URL from the sitemap: robots noindex flag, disabled status, draft status, unsupported locale (Arabic), or client-side-only route designation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Requesting `/sitemap.xml` returns a valid XML sitemap index with exactly 4 `<sitemap>` entries (pages, tours, blogs, categories), each pointing to a reachable sub-sitemap.
- **SC-002**: Every sub-sitemap URL returns valid XML passing validation against the sitemaps.org schema (verified via an XML schema validator tool).
- **SC-003**: Zero URLs in any sitemap use the backend domain (`sunpyramidtours.com`) — all `<loc>` values use the frontend domain (`sunpyramidstours.com`).
- **SC-004**: Zero URLs in any sitemap contain the `/en` prefix, the `/ar` locale prefix, or the `/checkout` path.
- **SC-005**: Every tour and blog URL in sub-sitemaps includes at minimum one hreflang alternate, and English URLs serve as x-default.
- **SC-006**: A newly published tour appears in `/sitemap-tours.xml` within one request (no cache delay aside from HTTP caching headers, if any) — confirming live API sourcing.
- **SC-007**: The old `public/sitemap.xml` static file is no longer served; all sitemap traffic routes through the dynamic implementation.

## Assumptions

- Phase 1-3 SEO fixes (001, 002, 003) are complete and stable. The sitemap relies on the same API endpoints (`/api/pages`, `/api/tours`, `/api/blogs`, `/api/tour-categories`, `/api/blog-categories`) with `?includes=seo,translations` and the `X-Localize` header pattern.
- The sitemap contract from `specs/001-seo-rendering-fix/contracts/sitemap-contract.md` defines the authoritative structure (sitemap index + 4 sub-sitemaps, validation rules) and this spec implements that contract.
- The Laravel API returns `robots` metadata per content item (including `noindex` flags) — this was verified in Phase 2 testing.
- The content volume is well under 50,000 URLs per sub-sitemap, so pagination/splitting is not required at this stage.
- Sitemap routes are publicly accessible (no authentication required) — search engines must reach them.
- `lastmod` dates are derived from the API's `updated_at` or equivalent field. If a content item lacks a modification date, the generation date is used.
- The existing `public/sitemap.xml` is the only static sitemap file to remove; no other static SEO files need changes.

## Manual Verification Tests (Dashboard-Driven)

These tests require the Laravel dashboard to mutate live data. The sitemap code handles them correctly (uses live API, routes have no hardcoded slugs), but end-to-end confirmation requires dashboard access.

### Test 1: New Tour Appears in Sitemap

1. Open the Laravel dashboard and publish a new tour
2. Wait for the tour to be live and accessible via the API
3. Request `GET /sitemap-tours.xml`
4. **Expected**: The new tour appears with correct `<loc>`, `<lastmod>`, and hreflang alternates across all 7 supported locales

### Test 2: Unpublished/Noindex Blog Post Disappears

1. Identify an existing published blog post in `/sitemap-blog.xml`
2. In the dashboard, either unpublish it or set `robots: noindex` in its SEO settings
3. Request `GET /sitemap-blog.xml`
4. **Expected**: The blog post is absent from the sitemap

### Test 3: Disabled Translation Drops from Hreflang Alternates

1. Identify a tour with translations in all 7 locales (visible in hreflang alternates of `/sitemap-tours.xml`)
2. In the dashboard, disable the translation for one locale (e.g., French)
3. Request `GET /sitemap-tours.xml`
4. **Expected**: The disabled locale is absent from that tour's hreflang alternates. Other tours' French alternates remain unaffected.

### Test 4: Noindex Tour Excluded from Sitemap

1. Identify an existing published tour in `/sitemap-tours.xml`
2. In the dashboard, set its SEO robots directive to `noindex`
3. Request `GET /sitemap-tours.xml`
4. **Expected**: The tour is absent from the sitemap

### Test 5: New Custom Marketing Page Appears Without Code Changes

1. In the dashboard, create a new custom marketing page with a unique slug
2. Ensure it is published and has noindex disabled
3. Request `GET /sitemap-pages.xml`
4. **Expected**: The new page appears with its correct URL and hreflang alternates — no code deployment was needed
