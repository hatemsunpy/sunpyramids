# Research: Dynamic Sitemap Generation

**Feature**: 004-sitemap-generation | **Date**: 2026-05-10

## Decision 1: Sitemap Serving Strategy — Nitro Server Routes

**Decision**: Use Nuxt 3 Nitro server routes (`server/routes/`) to serve sitemap XML directly. Each sitemap endpoint is a TypeScript file that fetches API data, builds an XML string, and returns it with `Content-Type: application/xml`.

**Rationale**: Nitro server routes are the standard way to serve non-HTML content in Nuxt 3. They execute on the server, have access to the same environment as SSR page rendering, and can use `$fetch` for API calls. The sitemap is pure XML with no Vue component involvement — server routes are the correct tool.

**Alternatives considered**:
- **Nuxt page component with custom render**: Overkill for XML. Would require disabling the layout, setting custom headers, and working around Vue's HTML-centric rendering.
- **External Node.js service**: Adds unnecessary infrastructure. The sitemap is part of the frontend application and should be maintained alongside it.
- **Static generation at build time**: Rejected — violates FR requirement for live API sourcing and defeats the purpose of dynamic sitemaps.

## Decision 2: XML Generation — String Template

**Decision**: Build XML via JavaScript template literals with proper escaping. No XML builder library.

**Rationale**: The sitemap XML schema is simple and stable (< 10 element types). Template literals are readable, have zero dependencies, and are the pattern used by the Nuxt sitemap module ecosystem. A dedicated XML library (e.g., `xmlbuilder2`) adds a dependency for a task that's ~20 lines of string concatenation.

**Alternatives considered**:
- **xmlbuilder2 / xml2js**: Overengineered for a flat URL list. Adds npm dependency and learning curve with no benefit at this scale.
- **Nuxt sitemap module (@nuxtjs/sitemap)**: Adds features we don't need (auto-discovery, multi-sitemap, caching) and may conflict with the custom i18n + domain setup. Simpler to write 5 route files directly.

## Decision 3: API Endpoint Mapping

**Decision**: Map each sub-sitemap to a specific Laravel API endpoint with appropriate query parameters:

| Sub-sitemap | API endpoint | Includes |
|-------------|-------------|----------|
| `sitemap-pages.xml` | `GET /api/pages?type=static,marketing&includes=seo` | seo |
| `sitemap-tours.xml` | `GET /api/tours?includes=seo,destinations,translations&page_limit=500` | seo, destinations, translations |
| `sitemap-blog.xml` | `GET /api/blogs?includes=seo,categories,translations&page_limit=500` | seo, categories, translations |
| `sitemap-categories.xml` | `GET /api/tour-categories?page_limit=100` + `GET /api/blog-categories?page_limit=100` | — |

**Rationale**: These endpoints match the sitemap contract from Phase 1 and have been verified in Phase 2 testing. The `?includes=seo` parameter returns `robots` metadata for exclusion filtering. The `page_limit` parameters ensure all content is returned in a single request.

**Alternatives considered**:
- **Single endpoint for all content**: The Laravel API doesn't provide an aggregated endpoint. Multiple parallel requests would add complexity without benefit.
- **Hardcoded lists with periodic sync**: Rejected — defeats the purpose of dynamic sitemaps.

## Decision 4: Marketing Page Discovery

**Decision**: Fetch custom marketing pages dynamically from `GET /api/pages?type=marketing&includes=seo`. Apply the same exclusion filters as static pages (published, not noindex, not disabled, not draft). Build URLs from the returned slug + locale data.

**Rationale**: Per the spec clarification (Session 2026-05-06), marketing page slugs MUST NOT be hardcoded. The API provides a dedicated endpoint/query parameter to list marketing pages. This keeps the sitemap aligned with dashboard content.

**Alternatives considered**:
- **Hardcoded list of known marketing page slugs**: Explicitly rejected by the spec clarification.
- **Separate sitemap-marketing.xml**: Unnecessary fragmentation. Marketing pages are pages and belong in the pages sub-sitemap.

## Decision 5: Timeout and Error Handling

**Decision**: Use a 30-second timeout per API call (matching Phase 3). On any API failure (timeout, 500, network error), the affected sub-sitemap returns an empty `<urlset>`. The sitemap index always renders with all 4 `<sitemap>` entries regardless of individual sub-sitemap failures.

**Rationale**: Partial failures should not break the entire sitemap. An empty `<urlset>` is valid XML and tells crawlers "nothing to index in this category right now" which is better than a 500 error. Crawlers will retry later.

**Alternatives considered**:
- **Omit failed sub-sitemap from index**: Would hide the failure from monitoring and potentially cause crawlers to forget previously discovered URLs.
- **Cache last successful response**: Adds complexity (storage, staleness). An empty urlset is the safest default.

## Decision 6: Static File Removal

**Decision**: Delete `public/sitemap.xml` as part of the implementation. The Nitro server route (`server/routes/sitemap.xml.ts`) takes precedence over static files in Nuxt's routing priority, but removing the static file eliminates ambiguity and ensures the dynamic route is the single source of truth.

**Rationale**: Keeping both creates confusion about which version is being served. Nuxt serves static files with higher priority than some route configurations, so deletion is the safest approach.

**Alternatives considered**:
- **Rename to `public/sitemap.xml.bak`**: Keeping a backup is reasonable but unnecessary — git history preserves the old file.
