# Feature Specification: Core Web Vitals Optimization

**Feature Branch**: `[fix/core-web-vitals]`
**Created**: 2026-05-14
**Status**: Draft
**Input**: User description: "Create and implement a detailed Core Web Vitals optimization plan using Spec Kit."

## 1. Problem Statement

The homepage currently fails key Core Web Vitals in Lighthouse lab testing.
- LCP is extremely high (18.1s diagnostic mode / 22.5s normal mode) because the critical hero/LCP resource depends on slow API/media waterfall, delayed image loading, render-blocking CSS, and heavy hydration.
- CLS is high (0.454) because images, cards, banners, and async-loaded components do not reserve stable layout space.
- TBT is high (3,060ms diagnostic mode / 4,220ms normal mode) because the main Nuxt app bundle, vendor bundle, hydration, and third-party scripts create heavy main-thread blocking.
- Image payload is excessive (87 requests, ~4.1MB), especially footer/social icons and multiple above/below-fold images.
- The document payload is abnormally large (~942KB), likely because too much API data is serialized into the Nuxt hydration payload.
- Third-party scripts make performance worse but are not the only root cause.
- Hydration mismatch indicates SSR/client rendering differences and may cause layout shifts, flicker, and unnecessary re-renders.

The goal is to fix first-party performance bottlenecks first, then measure third-party impact separately.

## 2. Current Performance Architecture Analysis

- **Frontend**: Nuxt 3.15 SSR. Heavy main-thread blocking on hydration.
- **Images/CDN**: Cloudflare/R2/Laravel storage. R2/Laravel storage cache TTL appears to be 0 seconds. Nuxt static/IPX cache TTL appears too short.
- **Prefetching**: Many internal route document requests caused by NuxtLink prefetching on card/listing components.
- **CSS**: 11 render-blocking stylesheets from component chunks delay FCP/LCP.
- **Hydration**: Hydration completed but contains mismatches.

## 3. Target Performance Architecture

- **CLS**: Stable layout elements where image/card containers reserve space before loading.
- **LCP**: Optimized hero image loading path (early preload, `fetchpriority="high"`, no lazy loading). Minimal API dependency for critical rendering path.
- **TBT**: Reduced initial JavaScript evaluation. Dynamic imports for non-critical components. Third-party widgets deferred.
- **Payload**: Minimized hydration payload (`__NUXT__`). Smaller SVG/WebP images instead of large PNGs.
- **Networking**: Disabled heavy Nuxt route prefetching automatically. Improved Cache-Control headers for static/media assets.

## 4. Risk Assessment

- **SEO Risk**: Changes to SSR HTML could break dashboard-driven SEO rendering, canonical URLs, hreflang, OG tags, or schema.
- **Functionality Risk**: Deferring scripts or lazy loading might break booking forms, contact forms, or navigation.
- **Display Risk**: Reserving space or lazy-loading might introduce visual glitches or layout issues on different devices.

## Clarifications

### Session 2026-05-14

- Q: What specific numeric CWV targets should replace the vague "improves significantly" language? → A: Option B — Google "Good" thresholds: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (field/RUM), TBT ≤ 200ms (lab proxy), FCP ≤ 1.8s, TTFB ≤ 800ms. Final pass/fail validated on staging/production, not local Docker.
- Q: How should Phase 6 handle the already-implemented ?no-third-party=1 diagnostic mode from Phase 5? → A: Option B — Keep as verification-only. Remove from Phase 6 implementation requirements, keep in testing/QA as regression check. No duplicate implementation.
- Q: Mobile vs desktop CWV targeting — which device profile determines pass/fail? → A: Option A — Mobile-only targeting. Official CWV validation uses Lighthouse Mobile emulation. Desktop is optional/supplementary and does not determine pass/fail.
- Q: How should production CWV be monitored continuously (not just one-time audits)? → A: Option B — Vercel Analytics only. Enable in Vercel dashboard for production field monitoring. No custom web-vitals library integration. Lighthouse for lab validation.
- Q: Which pages should Phase 6 CWV optimization cover? → A: Option B — Homepage + 1 representative tour detail page. Shared component fixes apply globally. About/contact/privacy deferred to later phase.

## User Scenarios & Testing

### User Story 1 - Fast Homepage Load (Priority: P1)
Users loading the homepage should experience a visually complete page (LCP) quickly without content jumping around (CLS).
**Independent Test**: Run Lighthouse locally and check LCP/CLS metrics against baseline.

### User Story 2 - Navigation without Prefetch Bloat (Priority: P2)
Users viewing the homepage should not automatically download dozens of internal route HTML documents.
**Independent Test**: Check Network tab -> Doc filter on homepage load to verify only the main document is loaded initially.

### User Story 3 - Booking Flow Preserved (Priority: P1)
Users must still be able to successfully book a tour without JavaScript deferral breaking the forms.
**Independent Test**: Complete a booking flow on staging.

## Requirements

### Functional Requirements
- **FR-001**: System MUST preserve dashboard-driven SEO rendering, crawlable links, canonical URLs, hreflang, OG/Twitter tags, and schema behavior.
- **FR-002**: Tour cards, images, and async content MUST reserve stable layout space to prevent CLS.
- **FR-003**: Oversized social media PNGs MUST be replaced with optimized SVGs or small WebP files.
- **FR-004**: Below-fold images MUST use `loading="lazy"`.
- **FR-005**: LCP image MUST NOT be lazy-loaded and MUST use `fetchpriority="high"`.
- **FR-006**: Repeated NuxtLinks on homepage cards MUST NOT prefetch automatically.
- **FR-007**: System MUST NOT produce a "Hydration completed but contains mismatches" warning on the homepage.
- **FR-008**: Phase 5 `?no-third-party=1` diagnostic mode MUST remain functional as a regression verification tool. Phase 6 does NOT re-implement it; it is used only for diagnostic comparison during QA/testing.
- **FR-009**: Vercel Analytics MUST be enabled for the production deployment to provide real-user CWV field data (LCP, CLS, INP, FCP, TTFB). Custom RUM/web-vitals library integration is deferred.

## Success Criteria

### Measurable Outcomes

**Primary CWV Targets** (Google "Good" thresholds, validated on staging/production):
- **SC-001**: LCP ≤ 2.5s on mobile emulation in Lighthouse lab audit.
- **SC-002**: CLS ≤ 0.1 on mobile emulation in Lighthouse lab audit.
- **SC-003**: TBT ≤ 200ms on mobile emulation in Lighthouse lab audit (lab proxy for INP).
- **SC-004**: INP ≤ 200ms in field/RUM data when available; TBT used as lab proxy when field data is unavailable.

**Supporting Metrics** (reported, do not override primary CWV verdict):
- **SC-005**: FCP ≤ 1.8s.
- **SC-006**: TTFB ≤ 800ms.

**Additional Quality Gates**:
- **SC-007**: No "Hydration completed but contains mismatches" warning in browser console.
- **SC-008**: Homepage initial load does not prefetch dozens of internal route documents.
- **SC-009**: Image transfer weight reduced (target image payload ≤ 2,000 KB on homepage).

**Production Monitoring**:
- **SC-010**: Vercel Analytics enabled and collecting CWV field data (LCP, CLS, INP) for production traffic.
- Custom RUM implementation is deferred to a later phase.
- Lighthouse remains the lab validation tool; Vercel Analytics provides ongoing production field data.

**Page Audit Scope**:
- **Homepage** (`/`) — primary entry point, highest traffic, most complex page mix.
- **One representative tour detail page** (`/tour/{slug}`) — highest-value commercial/conversion page type.
- Optimizations implemented in shared components (TourCard, BlogCard, DestinationCard, etc.) apply globally to all pages using those components.
- Out of scope for Phase 6: About, Contact, Privacy, and other static pages (deferred to later phase).

**Validation Environment**:
- Official CWV pass/fail uses **Lighthouse Mobile emulation** (simulated throttling: 4x CPU slowdown, slow 4G network).
- Desktop audits are optional and recorded for awareness only; they do not determine pass/fail.
- If mobile fails, the page fails the CWV gate even if desktop passes.
- Final CWV validation performed on staging or production-like infrastructure, not local Docker.
- Local Docker results may be used for diagnostics and relative improvement tracking.
- Field/RUM data (CrUX, Vercel Analytics) should supplement lab data where available.

## Assumptions
- Nuxt 3 server-side rendering is actively caching responses effectively.
- Testing on production/staging will more accurately measure server response times (TTFB) compared to the local Docker setup.

## 5. Sprint-based Implementation Plan

- **Sprint 1**: Measurement Baseline and Audit Setup
- **Sprint 2**: Fix CLS: Images, Cards, and Layout Stability
- **Sprint 3**: Image Weight Reduction and Responsive Images
- **Sprint 4**: LCP Optimization: Hero Image, API Waterfall, and Priority Loading
- **Sprint 5**: Disable Heavy Nuxt Route Prefetching
- **Sprint 6**: JavaScript and TBT Reduction
- **Sprint 7**: Fix Hydration Mismatch
- **Sprint 8**: CSS Render-Blocking Optimization
- **Sprint 9**: Cache Headers and CDN Configuration
- **Sprint 10**: Third-Party Script Control and Diagnostic Mode
- **Sprint 11**: API Payload and Homepage Data Optimization
- **Sprint 12**: Production/Staging Validation

## 6. Code-level Change List

- Update `TourCard`, `BlogCard`, `DestinationCard`, and hero components to add explicit dimensions and skeleton placeholders.
- Replace social/footer PNG icons with SVGs. Add `loading="lazy"` to below-fold images.
- Identify LCP image, add preload link, and apply `fetchpriority="high"`.
- Add `:prefetch="false"` or `no-prefetch` to heavy NuxtLinks in card components.
- Dynamically import non-critical components below the fold.
- Fix SSR-unsafe code in `onMounted()` or wrap with `<ClientOnly>` to eliminate hydration mismatches.
- Modify CDN and Nuxt static caching config to add `max-age=31536000, immutable`.
- Optimize API requests for homepage cards to reduce `__NUXT__` payload size.

## 7. Acceptance Criteria (Global)
1. CLS is significantly reduced toward <= 0.1.
2. LCP improves significantly on staging/production.
3. TBT improves significantly.
4. Homepage no longer loads dozens of internal route documents automatically.
5. Oversized social PNG icons are replaced or optimized.
6. Below-fold images lazy-load.
7. LCP image is prioritized and not lazy-loaded.
8. Image/card containers reserve stable space.
9. Hydration mismatch warning is fixed.
10. R2/Laravel/Nuxt static cache headers are improved.
11. Third-party diagnostic mode works with `?no-third-party=1`.
12. Normal mode still loads required analytics scripts.
13. SEO tags remain server-rendered and dashboard-driven.
14. Canonical/hreflang/OG/schema are unchanged except where fixes are intentional.
15. Crawlable internal links remain real href links.
16. Booking and contact forms still work.
17. No major visual regression on mobile or desktop.

## 8. Testing Checklist
- [ ] Run production build locally (`npm run build`, `npm run preview`).
- [ ] Lighthouse normal: `npx lighthouse http://localhost:3000/ --output=html --output-path=./reports/home-normal.html`
- [ ] Lighthouse diagnostic: `npx lighthouse "http://localhost:3000/?no-third-party=1" --output=html ...`
- [ ] Verify SEO tags (`canonical`, `hreflang`, `og:title`, `application/ld+json`) present in raw HTML (`curl`).
- [ ] Check Network tab -> Doc filter to ensure no route prefetch flood.
- [ ] Verify no "Hydration completed but contains mismatches" in browser console.
- [ ] Check image sizes and lazy-loading in Network -> Img filter.
- [ ] Check Cache-Control headers for static/media assets.

## 9. Rollback Plan
**Triggers**: Booking flow breaks, contact forms break, tour pages fail to render, SEO tags disappear, large visual regression, hydration errors worsen.
**Steps**:
1. Revert the `fix/core-web-vitals` branch.
2. Redeploy previous build.
3. Purge Cloudflare cache.
4. Verify homepage, tour page, contact page, and booking flow.
5. Re-run basic Lighthouse and SEO checks.
6. Investigate failed change in isolation.
