# Data & Performance Model: CWV Optimization

## 1. Critical Rendering Path (CRP) Data

To minimize TTFB and LCP, the following data is classified as **CRITICAL** and must be fetched during SSR:

| Data Entity | Source API | Usage | Optimization |
|-------------|------------|-------|--------------|
| Home Banner | `pages/home` | Hero Image (LCP) | Filter for only first image URL |
| SEO Tags | `pages/home` | Meta/Canonical | Full SEO object required |
| Featured Tours| `tours/home` | Above-fold content | Limit to first 4 items for initial SSR |

## 2. Deferred / Lazy Data

The following data should be deferred or fetched client-side to reduce initial payload:

| Data Entity | Strategy | Reason |
|-------------|----------|--------|
| Blogs | `Lazy` component | Below fold |
| Destinations | `Lazy` component | Below fold |
| Reviews | Client-only (TrustIndex) | Third-party dependency |

## 3. Hydration Payload Optimization (`__NUXT__`)

The target is to reduce the serialized payload from **942KB** to **<100KB**.

**Action Plan**:
- Use `pick` or `Transform` in `useFetch` to only include required fields from API responses.
- Avoid serializing large SVG/Base64 strings into the state.
- Clear non-persistent data from Pinia/State after hydration.

## 4. Resource Prioritization Table

| Resource | Type | Priority | Loading Strategy |
|----------|------|----------|------------------|
| Hero Image | Image | **CRITICAL** | `fetchpriority="high"`, `loading="eager"`, Preload |
| Main CSS | Style | **CRITICAL** | Inline critical CSS (if possible), else standard link |
| Swiper JS | Script | **NON-CRITICAL** | Dynamic import |
| Recaptcha | Script | **NON-CRITICAL** | `defer`, `async` |
| TrustIndex | Script | **NON-CRITICAL** | Defer until first interaction or `idle` |
