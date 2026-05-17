# Research: Core Web Vitals Optimization

## 1. Measurement Baseline (Current State)

| Metric | Homepage (Lab) | Homepage (Field) | Target |
|--------|----------------|------------------|--------|
| LCP    | 18.1s - 22.5s  | NEEDS DATA       | ≤ 2.5s |
| CLS    | 0.454          | NEEDS DATA       | ≤ 0.1  |
| TBT    | 3,060ms - 4,220ms | N/A           | ≤ 200ms|
| INP    | N/A            | NEEDS DATA       | ≤ 200ms|

**Observations**:
- Homepage document weight: ~942KB (extreme hydration payload).
- Homepage image weight: ~4.1MB (87 requests).
- 11 render-blocking CSS files.
- Hydration mismatch warning present.

## 2. Infrastructure & Configuration

### Nuxt Configuration (`nuxt.config.ts`)
- **SSR**: Enabled.
- **Prefetching**: Global prefetch is ENABLED (default). This causes dozens of route document requests on homepage load.
- **Vercel Analytics**: NOT implemented. Required for FR-009.
- **Image Module**: `@nuxt/image` is present.
- **Prerendering**: Disabled for all routes (`ignore: ["/*"]`).

### Cache Headers (R2/Laravel/Nuxt)
- Current TTL appears to be 0s or very short.
- Cloudflare/R2 headers need verification in production.

## 3. Component Analysis

### Homepage (`pages/index.vue`)
- **LCP Candidate**: `HomeMainBanner` (specifically the first image in the swiper).
- **Below Fold**: Most components are wrapped in `Lazy` (e.g., `LazyHomeMakeYourTrip`).
- **Third-Party**: `TrustIndex` script is added manually in `onMounted`.

### Main Banner (`components/home/MainBanner/index.vue`)
- **Issue**: First image is hidden (`absolute`) until `isSwiperReady` is true (50ms timeout). This delays LCP and causes shift.
- **Issue**: Fetches SEO data on every mount.

### Tour Card (`components/shared/TourCard.vue`)
- **Issue**: Uses a `swiper` for the gallery inside EVERY card. This is extremely heavy for TBT.
- **Issue**: Multiple `NuxtLink` components with default prefetch enabled.
- **Issue**: `NuxtImg` uses `loading="lazy"` but lacks explicit `width`/`height` beyond CSS `w-full h-full`.

## 4. Hydration Mismatches

**Suspected Causes**:
1. `TrustIndex` script injecting DOM elements client-side.
2. `Lazy` component hydration timing differences.
3. SSR/Client data mismatch in `sharedStore` (currencies/languages).
4. Swiper initialization timing.

## 5. Summary of Unknowns

- **U-01**: Exact production Cache-Control headers for `.webp` assets from R2.
- **U-02**: Vercel project ID for analytics enablement.
- **U-03**: Impact of disabling `experimental.defaults.nuxtLink.prefetch` on global navigation UX.
- **U-04**: Source of the 942KB hydration payload (which API call is being serialized?).

## 6. Recommended Research Tasks

- [ ] **T-01**: Run `npm run build && npm run preview` and check `__NUXT__` payload size in HTML.
- [ ] **T-02**: Audit API response sizes for `pages/home?includes=seo` and `tours/home`.
- [ ] **T-03**: Verify if `Vercel Analytics` can be enabled purely via dashboard without `@vercel/analytics` package (Nuxt 3).
- [ ] **T-04**: Test `prefetch="false"` on a single `TourCard` and verify document requests in Network tab.
