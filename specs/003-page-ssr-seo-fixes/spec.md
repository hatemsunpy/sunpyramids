# Feature Specification: Page-Level SSR SEO Fixes

**Feature Branch**: `003-page-ssr-seo-fixes`
**Created**: 2026-05-04
**Status**: Draft
**Input**: User description: "phase 3"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search Engines Receive Complete SEO Metadata From All Pages (Priority: P1)

When a search engine crawler or social media bot requests any public page, the raw HTML response must contain complete SEO metadata: page title, meta description, Open Graph tags, Twitter card tags, canonical URL, hreflang links, and structured data. Currently, several page types send their HTML response before SEO data is ready, so crawlers see empty or incomplete `<head>` sections.

**Why this priority**: Without SEO metadata in the initial HTML, pages are invisible to search engines and social platforms. Ranking, rich results, and social link previews are impossible for these pages. This is the core visibility problem blocking all SEO efforts.

**Independent Test**: Use a tool that fetches the raw HTML of any public page (without executing JavaScript) and confirms the presence of `<title>`, `<meta name="description">`, `og:title`, `og:description`, `twitter:title`, canonical link, hreflang links, and structured data.

**Acceptance Scenarios**:

1. **Given** a crawler requests the Contact Us page, **When** the server responds, **Then** the raw HTML contains a page-specific `<title>`, `<meta name="description">`, OG tags, Twitter tags, canonical URL, hreflang links, and structured data from the dashboard.
2. **Given** a crawler requests the About Us page, **When** the server responds, **Then** the raw HTML contains complete SEO metadata sourced from the About Us dashboard entry.
3. **Given** a crawler requests a tour detail page, **When** the server responds, **Then** the raw HTML contains SEO metadata specific to that tour (tour name as title, tour description).
4. **Given** a crawler requests the Egypt Travel Guide listing page, **When** the server responds, **Then** the raw HTML contains complete SEO metadata sourced from that page's dashboard entry.
5. **Given** a crawler requests a Nile Cruises listing page, **When** the server responds, **Then** the raw HTML contains complete SEO metadata from the dashboard.
6. **Given** a crawler requests a Shore Excursions listing page, **When** the server responds, **Then** the raw HTML contains complete SEO metadata from the dashboard.
7. **Given** a crawler requests a travel guide category page, **When** the server responds, **Then** the raw HTML contains complete SEO metadata from the dashboard.
8. **Given** a crawler requests the Multi-Day Tours listing page, **When** the server responds, **Then** the raw HTML contains complete SEO metadata from the dashboard.
9. **Given** a crawler requests a page whose SEO data fetch fails (API timeout or error), **When** the server responds, **Then** the page still renders with a safe fallback title and no broken or half-written SEO tags.

---

### User Story 2 - Homepage Serves Complete SEO Metadata to Crawlers (Priority: P1)

The homepage currently has its SEO data fetching disabled. When restored, the homepage must serve complete SEO metadata in the initial HTML response, sourced from the Home page dashboard entry. The homepage is the most-linked and most-crawled page on the site — its SEO tags are critical for brand search results and social sharing.

**Why this priority**: The homepage is the most important page for search visibility and brand recognition. Having no SEO tags on the homepage means the site's primary entry point generates no rich previews when shared and has diminished search presence.

**Independent Test**: Fetch the raw HTML of the homepage and confirm all SEO metadata is present in the initial response.

**Acceptance Scenarios**:

1. **Given** a crawler or social bot requests the homepage (`/`), **When** the server responds, **Then** the raw HTML contains a page-specific `<title>`, `<meta name="description">`, OG tags, Twitter tags, canonical URL, hreflang links, and structured data.
2. **Given** the Home page dashboard entry has custom OG fields populated, **When** the homepage renders, **Then** OG tags use those custom dashboard values (not generic site defaults).

---

### User Story 3 - Homepage Loads Without Wasting Bandwidth On Unvisited Pages (Priority: P2)

When a user visits the homepage, their browser should not automatically fetch the HTML of every linked tour, blog post, destination, and category page. Currently, the platform pre-loads linked pages in the background, causing dozens of unnecessary network requests that consume bandwidth and slow down the visible page. This wastes server resources and degrades the experience for users on slow connections.

**Why this priority**: Unnecessary pre-loading of internal pages wastes bandwidth, increases server load, and harms perceived performance — especially for mobile users and users on metered connections. While not as critical as missing SEO metadata, it directly impacts user experience and hosting costs.

**Independent Test**: Load the homepage and monitor network requests during initial page load. Only the homepage document and its essential assets (images, styles, fonts) should be requested. No internal page documents should be auto-fetched.

**Acceptance Scenarios**:

1. **Given** a user visits the homepage, **When** the page loads, **Then** only the homepage document and its essential assets are fetched — no tour pages, blog pages, destination pages, or category pages are pre-loaded automatically.
2. **Given** a user hovers over or clicks a navigation link in the header, **When** the interaction occurs, **Then** the target page loads promptly (navigation experience is not degraded).
3. **Given** a user visits the homepage, **When** the page renders, **Then** all tour cards, blog cards, destination cards, and category cards remain visible and functional — the fix does not remove or hide any content.

---

### User Story 4 - All Navigation Links Are Visible To Search Engines (Priority: P2)

Every internal navigation link on the homepage and throughout the site must remain a real, crawlable hyperlink in the rendered HTML. Links must not be hidden behind JavaScript-only click handlers, lazy-loaded in a way that removes them from the HTML, or otherwise made invisible to crawlers. Users must be able to navigate by clicking links even when JavaScript is disabled.

**Why this priority**: Search engines discover and index pages by following `<a href>` links in HTML. If internal links are removed from the HTML or converted to JS-only interactions, those pages become invisible to crawlers, reducing the site's indexed page count and internal link equity.

**Independent Test**: Fetch the raw HTML of any page and confirm all navigation links, tour cards, blog cards, and category cards contain standard hyperlink elements with valid `href` attributes. Verify navigation works with JavaScript disabled in the browser.

**Acceptance Scenarios**:

1. **Given** a crawler parses the homepage HTML, **When** it looks for links, **Then** every tour card contains a valid hyperlink to its tour detail page.
2. **Given** a crawler parses the homepage HTML, **When** it looks for links, **Then** every blog card contains a valid hyperlink to its blog post page.
3. **Given** a user has JavaScript disabled in their browser, **When** they click any navigation link or card on the homepage, **Then** the browser navigates to the target page successfully.
4. **Given** the prefetch optimization from US3 is applied, **When** the page renders, **Then** zero hyperlinks are removed, hidden, or converted to non-crawlable formats.

---

### Edge Cases

- What happens when a page's SEO API endpoint returns a 500 error? The page must still render with a safe fallback title (e.g., "Sun Pyramids Tours") and must not crash, serve a blank page, or emit broken SEO tags.
- What happens when a page's SEO data takes longer than 30 seconds to respond? The server must time out gracefully and render the page without SEO tags rather than hanging indefinitely.
- What happens when a page has no dashboard SEO entry at all (new page, draft, or data missing)? The page must render with a safe default title rather than crashing.
- What happens when the prefetch optimization is applied but a specific navigation element feels slow? Critical navigation links (header menu) may optionally retain pre-loading if needed, but this must be an explicit, documented exception — not a blanket re-enable.
- What happens when a linked page returns a 404? The link must still appear in the HTML as a crawlable element. The 404 status is handled when the link is followed, not by removing the link from the source.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us page MUST include complete SEO metadata (title, description, OG tags, Twitter tags, canonical, hreflang, schema) in its initial HTML response, sourced from the Contact Us dashboard entry.
- **FR-002**: The About Us page MUST include complete SEO metadata in its initial HTML response, sourced from the About Us dashboard entry.
- **FR-003**: The tour detail page MUST include complete SEO metadata in its initial HTML response, sourced from the tour's own SEO fields (tour name, tour description).
- **FR-004**: The Egypt Travel Guide listing page MUST include complete SEO metadata in its initial HTML response, sourced from its dashboard entry.
- **FR-005**: The Nile Cruises listing page MUST include complete SEO metadata in its initial HTML response, sourced from its dashboard entry.
- **FR-006**: The Shore Excursions listing page MUST include complete SEO metadata in its initial HTML response, sourced from its dashboard entry.
- **FR-007**: The travel guide category page MUST include complete SEO metadata in its initial HTML response, sourced from its dashboard entry.
- **FR-008**: The Multi-Day Tours listing page MUST include complete SEO metadata in its initial HTML response, sourced from its dashboard entry.
- **FR-009**: The Homepage MUST include complete SEO metadata in its initial HTML response, sourced from the Home page dashboard entry.
- **FR-010**: Every page MUST wait for SEO data to be ready before sending the HTML response to the client. The server response must be blocked until SEO data is either successfully loaded or has failed with a safe fallback.
- **FR-011**: When a page's SEO data fetch fails (network error, API error, timeout), the page MUST render with a safe fallback title and clean HTML — no broken tags, no 500 errors, no truncated output.
- **FR-012**: The homepage MUST NOT automatically pre-fetch the HTML of linked internal pages (tours, blogs, destinations, categories) on initial load.
- **FR-013**: Critical header navigation links MAY optionally retain pre-fetching to preserve navigation speed, but this must be an explicit, documented decision.
- **FR-014**: ALL internal navigation links, tour cards, blog cards, destination cards, and category cards MUST remain as standard hyperlinks in the rendered HTML — crawlable by search engines and functional without JavaScript.
- **FR-015**: The prefetch optimization MUST NOT remove, hide, or alter any hyperlink from the HTML source.

### Key Entities

- **PageSEOData**: The SEO metadata bundle for a specific page. Includes: title, description, OG fields (title, description, image, type, URL), Twitter fields (card type, title, description, image), canonical URL, available language translations for hreflang generation, and structured data schema. Sourced from the dashboard page entry via an API call that includes `?includes=seo`.
- **ServerRender**: The process of generating the complete HTML page on the server before sending it to the client. Must pause for SEO data readiness. A page that renders before its SEO data arrives produces an incomplete response.
- **SafeFallback**: A minimal set of defaults used when SEO data cannot be loaded. Includes a site-wide default title ("Sun Pyramids Tours"). Must never produce broken HTML, half-written tags, or error messages visible to end users.
- **PrefetchRequest**: An automatic background fetch of a linked page's HTML before the user clicks. When enabled globally, every visible link triggers a prefetch. The optimization removes this anticipatory behavior for non-critical links while preserving it where needed for navigation quality.
- **CrawlableLink**: A standard HTML anchor element (`<a href="...">`) present in the server-rendered HTML source. Visible to search engine crawlers, functional on click without JavaScript, and preserving internal link structure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fetching the raw HTML of any of the 9 target pages (Contact Us, About Us, tour detail, Egypt Travel Guide, Nile Cruises, Shore Excursions, travel guide category, Multi-Day Tours [verify-only, already correct], Homepage) without JavaScript execution shows complete SEO metadata: `<title>`, `<meta name="description">`, OG tags, Twitter tags, canonical URL, hreflang links, and structured data.
- **SC-002**: The Homepage raw HTML contains SEO metadata sourced from the Home dashboard entry (not a generic fallback), confirming the previously disabled SEO integration is restored.
- **SC-003**: Pages with a simulated API failure render successfully with status 200 and a safe fallback title — no 500 errors and no broken or truncated HTML.
- **SC-004**: Loading the homepage triggers zero automatic fetches of internal page documents (tour detail pages, blog pages, destination pages). Only the homepage document and its essential assets are requested on initial load.
- **SC-005**: Header navigation between main sections (Home → Tours → Contact → About) completes within 500ms of click on a simulated Fast 3G connection after the prefetch optimization is applied.
- **SC-006**: The raw HTML of the homepage and listing pages contains valid hyperlinks for every tour card, blog card, destination card, and category card — verified by parsing the HTML source for `<a href="...">` elements matching each card's target URL.
- **SC-007**: All 7 supported locales serve locale-specific SEO data on their localized page variants (content in the correct language for the requested locale).

## Assumptions

- Phase 2 foundational fixes (hreflang, OG/Twitter attribute correctness, meta keywords exclusion, schema safety, X-Localize headers) are complete and working. This phase builds on that foundation.
- The correct pattern for SSR-safe SEO is already established in working pages (`faqs.vue`, `blogs/all-blogs.vue`) and can be replicated to broken pages.
- The prefetch optimization can be applied globally (default: disabled) and selectively re-enabled on specific critical navigation components if needed.
- The site already uses standard hyperlink components that render as `<a href="">` in HTML. The link audit confirms this behavior is preserved, not created from scratch.
- The Laravel API respects the `X-Localize` header and returns locale-appropriate SEO data — this was verified in Phase 2.
- The `contact-us.vue` and `about-us.vue` pages follow a similar broken pattern (async function wrapper called without await) and can be fixed the same way.
- English is the default locale and its URLs use the root path without the `/en` prefix.
- Trailing-slash redirects remain out of scope for this phase.
