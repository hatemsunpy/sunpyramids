# Research: Page-Level SSR SEO Fixes

**Feature**: 003-page-ssr-seo-fixes | **Date**: 2026-05-04

## Decision 1: Fix Pattern for Broken Pages (5 pages with async wrapper without await)

**Decision**: Convert each broken page from the "async wrapper called without await" pattern to the "top-level await + direct addSeo" pattern already proven in `faqs.vue` and `blogs/all-blogs.vue`.

**Rationale**: Five pages (`contact-us.vue`, `about-us.vue`, `egypt-travel-guide/index.vue`, `nile-cruises/index.vue`, `shore-excursions/index.vue`, `egypt-travel-guide/[cate]/index.vue`) wrap their SEO data fetching in an async helper function then call it without `await`. This is fire-and-forget from the SSR perspective — the server sends HTML before the data resolves. The fix is to remove the wrapper function and use a direct top-level `await` on `getData()`, followed by a direct `addSeo()` call. This matches the established correct pattern and requires no new abstractions.

**Alternatives considered**:
- **Add `await` before the async wrapper call**: Would work for `contact-us`/`about-us`/`nile-cruises`/`shore-excursions`/`travel-guide-[cate]` but not for `egypt-travel-guide/index.vue` which has a double bug (inner `getData` also lacks `await`). Removing the wrapper entirely is simpler, more consistent, and matches existing correct pages.
- **Centralized SSR-safe SEO fetch utility**: Would add unnecessary abstraction for what is essentially removing a wrapper function. The pattern is already standardized across working pages; no new utility needed.

## Decision 2: Homepage SEO Restoration (`pages/index.vue`)

**Decision**: Uncomment lines 50-57 in `pages/index.vue` and adapt to the proven pattern: top-level `await getData('pages/home?includes=seo')` followed by direct `addSeo(homeData.value)`.

**Rationale**: The commented-out code already follows the correct pattern. It needs only uncommenting, variable naming alignment, and the `.then()` chain flattened to use the direct `await` pattern from `faqs.vue`.

**Alternatives considered**:
- **Write from scratch**: Unnecessary — the commented code is structurally correct.
- **Use a different API endpoint**: The existing `pages/home` endpoint is the established one used by Phase 2 testing.

## Decision 3: Tour Detail Page (`pages/tour/[id].vue`) — Simplify or Leave

**Decision**: Replace the `watch(tour, callback, { immediate: true })` with a direct `addSeo(tour.value)` call after the top-level `await`.

**Rationale**: The page works correctly today because the top-level `await` blocks SSR and `{ immediate: true }` fires the watcher during the same render pass. However, the watcher adds unnecessary indirection and risk. A direct call after the await is simpler, more explicit, and matches the reference pattern. This is a defensive simplification, not a bug fix.

**Alternatives considered**:
- **Leave the watcher as-is**: The page already works. The watcher is harmless and removing it adds no new functionality. But simplifying it removes a potential footgun if someone later changes `{ immediate: true }` or wraps the watcher in a conditional.

## Decision 4: Prefetch Control (GATE-10)

**Decision**: Add `experimental.defaults.nuxtLink.prefetch: false` to `nuxt.config.ts` to disable global NuxtLink prefetch, then selectively re-enable prefetch only on header navigation components if navigation UX degrades.

**Rationale**: Nuxt's default prefetch behavior fires a fetch for every `<NuxtLink>` in the viewport on page load. On the homepage, this means dozens of unnecessary text/html requests (tours, blogs, destinations, categories) that waste bandwidth and server resources. A global disable is the simplest safe approach. If header navigation feels slow after the change, `prefetch` can be explicitly re-enabled on the header `<NuxtLink>` components only.

**Alternatives considered**:
- **Component-level `:prefetch="false"` on every card/listing link**: More surgical but fragile — every new card component added in the future would need the same treatment. Global disable is a single change that covers all current and future card components.
- **Intersection Observer with viewport-based prefetch**: Overengineered for this phase. Global disable is simpler and safer.

## Decision 5: Link Crawlability Audit (GATE-11)

**Decision**: Confirm all navigation links remain `<a href="">` elements after the prefetch disable. Since the project already uses standard `<NuxtLink>` components that render as `<a href="">`, no link structure changes are needed — only verification.

**Rationale**: Vue's `<NuxtLink>` always renders as an `<a href="">` element in the final HTML regardless of prefetch settings. The `prefetch: false` config only stops the background fetch behavior; it does not alter the rendered DOM. The "fix" is verification that this holds true after the prefetch change.

**Alternatives considered**: None. This is a verification-only step.

## Decision 6: API Error Resilience During SSR

**Decision**: Add a try/catch around the `getData()` call in each fixed page, with a catch block that sets safe defaults and calls `addSeo()` with minimal fallback data.

**Rationale**: The spec (FR-011) requires pages to render safely when API calls fail. Phase 2's `useSeo.js` already handles invalid schema gracefully. Page templates need equivalent error boundaries around the data fetch itself so a network error doesn't crash the SSR render. The `faqs.vue` page may also need this added retroactively.

**Alternatives considered**:
- **Centralized error boundary in `useApi.js`**: Would hide errors from page templates that need to know about failures to render fallback UI. Page-level try/catch gives each template control over its fallback behavior.
- **Nitro error page**: Too heavy — we want a normal 200 page with fallback content, not an error page.
