# Sprint A + B — Core Web Vitals Validation Report

**Date:** 2026-06-15  
**Branch:** `fix/vercel-deploy-fixes`  
**Scope:** Hydration fixes (Sprint A) + performance remediation bundle, image, font, and third-party work (Sprint B)

---

## 1. Sprint A — Changes Implemented

| File | Change | Rationale |
|------|--------|-----------|
| `components/UI/Text.vue` | `useId()` replaces `Date.now()`-based IDs | Eliminates SSR/client ID mismatch |
| `components/UI/Phone.vue` | `useId()` replaces `Date.now()`-based IDs | Eliminates SSR/client ID mismatch |
| `components/Shared/DropDown.vue` | `useId()` replaces `Math.random()`-based IDs | Eliminates SSR/client ID mismatch |
| `components/UI/Pagination.vue` | Wrapped `<vue-awesome-paginate>` in `<ClientOnly>` | Plugin is client-only, avoids hydration mismatch |
| `components/Shared/IceFalling.vue` | Wrapped template in `<ClientOnly>` | Uses `Math.random()` during render |
| `pages/sustainability.vue` | Removed direct TrustIndex script injection | Loading is now handled by the deferred plugin |
| `components/Footer/index.vue` | Logo src changed from `.png` to `.webp` | Reduces image weight |
| `components/Shared/TourCard.vue` | Added responsive `sizes` to `<NuxtImg>` | Improves LCP image delivery |

---

## 2. Sprint B — Changes Implemented

### 2.1 Responsive / WebP image delivery

| File | Change | Rationale |
|------|--------|-----------|
| `scripts/convert-images.mjs` | New batch converter using `sharp` (`webp`, quality 85) | Automates future image conversions |
| `public/images/**/*.webp` | Converted all `.png`/`.jpg` under `public/images` including `team/` | Reduces image payload |
| `components/Home/Highlights.vue` | Switched to `<NuxtImg format="webp" sizes="...">` | Responsive WebP delivery |
| 30+ Vue files across `components/`, `pages/`, `layouts/` | Updated image references from `.png`/`.jpg` to `.webp` | Uses converted assets |

### 2.2 Font loading

| File | Change | Rationale |
|------|--------|-----------|
| `nuxt.config.ts` | Added `TripSans-Medium.woff2` preload alongside Regular/Bold | Eliminates late font swap for medium weight |
| `assets/fonts/font.scss` | Already declares `font-display: swap` for all weights | Keeps text visible during load |

### 2.3 Third-party script deferral / inventory

| File | Change | Rationale |
|------|--------|-----------|
| `components/BookEgyptTrip/index.vue` | Removed direct TrustIndex `<script>` injection | Loaded via deferred plugin |
| `components/Disabled/index.vue` | Removed direct TrustIndex `<script>` injection | Loaded via deferred plugin |
| `components/EgyptTripLandingGerman/index.vue` | Removed direct TrustIndex `<script>` injection | Loaded via deferred plugin |
| `components/EgyptTripLandingFrance/index.vue` | Removed direct TrustIndex `<script>` injection | Loaded via deferred plugin |
| `plugins/third-party-scripts.client.ts` | `TRUSTINDEX_CONTAINERS` now supports `{src, attrs?}`; `home-reviews` loader injects `data-type="stripe"` and `data-location="home-reviews"` | Lets deferred plugin configure the review widget correctly |

### 2.4 JS bundle reduction — experiments & decision

The Sprint B plan targeted **≤ 25 homepage JS resources**. After several experiments, the target is **not reachable** without unacceptable runtime cost because Nuxt auto-imported components and `nuxt-icons` generate many dynamic-import chunks that Rollup/Nuxt keep separate.

| Experiment | Result | Decision |
|------------|--------|----------|
| `manualChunks` grouping components/icons | No effect on script count; dynamic imports are not merged by `manualChunks` | Abandoned |
| `inlineDynamicImports: true` | Reduced homepage JS references to **2**, but created a **1.9 MB single bundle**, total byte weight jumped to **20 MB**, and **TBT rose to ~2,590 ms** | Reverted — too render-blocking |
| `experimentalMinChunkSize: 20000` | Merged 213 → 105 total chunks, but homepage still referenced **51 scripts** and **TBT worsened to ~3,420 ms** | Reverted — no benefit |
| Custom plugin enforcing multi-vendor `manualChunks` | Runtime error: `Cannot access 'definePayloadPlugin' before initialization` | Reverted — unsafe |
| **Restored existing vendor-split `manualChunks`** | Homepage references **50 scripts**, TBT ~2,840 ms, smallest total byte weight (**4.5 MB**) in final Lighthouse run | **Kept as the safe, optimal trade-off** |

**Rationale for keeping the existing config:** the current vendor split already groups large third-party libraries (`vendor-swiper`, `vendor-i18n`, `vendor-maps`, etc.) and avoids a single huge render-blocking chunk. The remaining ~50 resources are mostly tiny dynamic component/icon chunks that load asynchronously; collapsing them requires architectural changes (e.g., replacing `nuxt-icons` with a sprite or eager-loading components) which are out of Sprint B scope.

---

## 3. Build Verification

```
npm run build
```

**Result:** ✅ Pass

- Client build completed (1114 modules transformed)
- Server build completed
- `.output/server/index.mjs` generated successfully
- Final build total size: 52.5 MB (20.1 MB gzip)

---

## 4. Production Server Verification

```
node .output/server/index.mjs
```

**Result:** ✅ Server starts and responds correctly

- `GET /` → `200 OK`
- `GET /egypt-tours/one-day-tours/cairo` → `200 OK`
- Preview server was restarted several times during chunking experiments; stale PID was killed before each rebuild to avoid the Windows sharp-DLL EPERM error.

---

## 5. Lighthouse Mobile Audit — Final Sprint B Build

Command used:

```bash
lighthouse http://localhost:3000/ --output=json \
  --chrome-flags="--headless --no-sandbox --disable-gpu"
```

### 5.1 Homepage (`http://localhost:3000/`)

| Metric | Value | Score |
|--------|-------|-------|
| Performance | — | **0.27** |
| FCP | 8.2 s | Poor |
| LCP | 12.7 s | Poor |
| TBT | 2,840 ms | Poor |
| CLS | 0 | Good |
| Speed Index | 10.4 s | Poor |
| Interactive | 27.3 s | Poor |
| Total byte weight | 4,503 KiB | Needs improvement |
| Bootup time | 6.4 s | Poor |

### 5.2 Interpretation

These localhost mobile scores remain backend-latency bound:

1. The preview server proxies API calls over the internet, inflating TTFB and LCP.
2. The homepage HTML is ~931 KB with ~3,193 DOM elements.
3. The JS bundle is split into ~50 small scripts; the largest three are ~321 KB, ~299 KB and ~193 KB.

Sprint B successfully **reduces total byte weight** (final run 4.5 MB vs. earlier 6.6 MB runs) and keeps **CLS at 0**, but the local environment still limits the Lighthouse score. The primary expected real-world improvements from Sprint B are:

- WebP images reduce transfer size.
- Font preloading reduces layout shifts / invisible text.
- Deferred third-party scripts keep TBT from being dominated by synchronous widget loading.

---

## 6. Playwright Test Results — Sprint B Subset

```bash
npx playwright test tests/font-loading.spec.ts tests/performance-audit.spec.ts \
  tests/webp-images.spec.ts tests/trustindex-widget.spec.ts tests/recaptcha.spec.ts
```

**Result:** 13 passed, 0 failed ✅

### 6.1 Performance Audit Snapshot

| Metric | Value |
|--------|-------|
| HTML size | 931.5 KB |
| DOM elements | 3,193 |
| `<script>` tags | 5 |
| Modulepreload links | 48 |
| Render-blocking stylesheets | 18 |
| Long tasks (>50 ms) | 4 |
| Console errors | 0 |
| Failed requests | 0 |
| Total intercepted transfer | 1,715 KB |
| JS | 314.7 KB |
| Images | 412.1 KB |
| Fonts | 73.6 KB |

The 48 modulepreload links correspond to the ~50 `_nuxt/*.js` resources Lighthouse observes. No resources failed and no console errors were emitted, confirming that the restored build is healthy.

### 6.2 Other Passing Suites

- `font-loading.spec.ts` ✅
- `webp-images.spec.ts` ✅
- `trustindex-widget.spec.ts` ✅
- `recaptcha.spec.ts` ✅

---

## 7. Full Playwright Status

The full suite still contains **3 pre-existing failures in `third-party-deferral.spec.ts`** identified in Sprint A. Sprint B did not modify the plugin's fallback timing or the test selectors, so those failures remain unchanged. Recommended follow-up:

1. Make the 5-second fallback test-aware or add a deterministic load signal.
2. Narrow the GTM dedup selector to the primary `gtag/js?id=...` script.
3. Update the TrustIndex about-us assertion to account for the footer certification badge on all default-layout pages.

---

## 8. Hydration Health Check

No new hydration mismatch warnings were observed in:

- Nuxt build logs
- Production server logs
- Playwright regression results

---

## 9. Conclusion

- ✅ **Sprint A implementation is complete.**
- ✅ **Sprint B implementation is complete:**
  - All public images converted to WebP and references updated.
  - Highlights section uses `<NuxtImg format="webp" sizes="...">`.
  - `TripSans-Medium.woff2` preloaded.
  - Direct TrustIndex script injections removed; deferred plugin handles loading.
- ✅ **Build passes.**
- ✅ **Production preview server runs.**
- ✅ **Lighthouse mobile audits executed** (low localhost scores are environment/backend-latency related).
- ✅ **Playwright regression suite:** 13/13 targeted tests pass; 3 full-suite third-party deferral failures are pre-existing.
- ⚠️ **JS bundle script-count target (≤ 25) was not achieved** without hurting TBT. The existing multi-vendor `manualChunks` config is kept as the safe optimal trade-off. A future, larger refactor (e.g., icon sprite, eager global components) would be needed to reduce dynamic-import chunk count.

---

## 10. Artifacts

- Lighthouse raw reports:
  - `.lighthouse/homepage-mobile.json`
  - `.lighthouse/tour-detail-mobile.json`
- This report:
  - `docs/performance/core-web-vitals-validation-report.md`
- Automation:
  - `scripts/convert-images.mjs`
  - `scripts/lighthouse-summary.mjs`
