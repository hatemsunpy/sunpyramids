# Core Web Vitals Analysis — Sun Pyramids Tours

**Date**: 2026-05-14
**Environment**: Local Docker (node:20-alpine, Nuxt 3.15 SSR)
**Test URL**: http://localhost:3000/
**Audit Tool**: Lighthouse 12.x (lab data — not field/RUM)

---

## 1. CWV Scorecard

| Metric | Diagnostic Mode | Normal Mode | Threshold (Good) | Verdict |
|--------|----------------|-------------|-------------------|---------|
| **LCP** | 18.1s | 22.5s | ≤ 2.5s | POOR |
| **CLS** | 0.454 | 0.454 | ≤ 0.1 | POOR |
| **TBT** | 3,060ms | 4,220ms | ≤ 200ms | POOR |
| **FCP** | 9.1s | 8.8s | ≤ 1.8s | POOR |
| **TTFB** | 2,305ms | — | ≤ 800ms | POOR |
| **SI** | 11.5s | 12.1s | ≤ 3.4s | POOR |

**Note**: These are lab measurements from a local Docker container on a dev machine. Production Vercel edge deployments will have significantly better TTFB and LCP. Field data (CrUX/RUM) needed for production assessment.

---

## 2. LCP Breakdown (18.1s)

The LCP of 18.1 seconds breaks down as follows:

```
TTFB (server response):  ~2,305ms  ████████
Resource load delay:     ~3,000ms  ███████████ (estimated)
Resource load time:      ~8,000ms  ██████████████████████████████ (estimated, API images)
Render delay:            ~4,700ms  █████████████████ (estimated)
                                   
Total:                    18,056ms
```

### Root causes:
1. **TTFB 2.3s**: Nuxt SSR rendering on local Docker — no edge caching. Production on Vercel should be 200-500ms
2. **API-dependent LCP**: The LCP element is a hero image from the Laravel backend or R2 CDN. Slow API response → slow LCP
3. **Render-blocking CSS**: 11 stylesheets block the first paint, delaying LCP by ~349ms each

### LCP request chain:
The critical rendering path includes API calls to `sunpyramidstours.com/api/` for tour data, which then loads images from R2 CDN. This waterfall is the primary LCP bottleneck.

---

## 3. CLS Analysis (0.454)

### Clusters identified: 3 shifts
All 3 shift sources are dynamic content (marked "unknown" by Lighthouse). Likely culprits:

1. **Tour cards loading from API**: Cards render at different sizes as images load, pushing content down
2. **Font swap**: Web fonts loading causes text reflow (no `font-display: swap` audit failed, but it's a common cause)
3. **Dynamic banners/popups**: trustindex.io widget or cookie consent banner

### CLS contribution by phase:
- During load: 0.400+ (main shifts happen as async content loads)
- Post-load: ~0.050 (minor shifts from lazy-loaded content)

### Fix priority:
1. Reserve space for tour card images (set explicit `width`/`height` or `aspect-ratio` in CSS)
2. Preload LCP image and above-the-fold images
3. Add `font-display: swap` or `optional` to web fonts
4. Set explicit dimensions on all async-loaded content containers

---

## 4. TBT / INP Analysis (3,060ms)

### Main Thread Work (16.4s total CPU)

| Activity | Duration | % of Total |
|----------|----------|------------|
| Script Evaluation | 6,336ms | 38.6% |
| Other (layout, GC, etc.) | 4,256ms | 26.0% |
| Style & Layout | 2,350ms | 14.3% |
| Paint & Composite | 745ms | 4.5% |
| Parse HTML | 394ms | 2.4% |
| Garbage Collection | 157ms | 1.0% |
| Script Parse/Compile | 145ms | 0.9% |

### Top JS Cost Centers

| Script | Scripting Time | Total Time | Source |
|--------|---------------|------------|--------|
| Unattributable | 2,782ms | 4,401ms | Inline scripts, eval, unknown |
| `DWN6cZiy.js` | 2,261ms | 2,282ms | Main Nuxt app bundle |
| `tHyG9D3x.js` | 612ms | 3,976ms | Second bundle (likely vendors) |
| Document inline | 321ms | 2,530ms | SSR hydration + inline scripts |
| reCAPTCHA | 151ms | 270ms | Google reCAPTCHA enterprise |
| `loader-cert.js` | 64ms | 493ms | trustindex.io certificate |
| `loader.js` | 33ms | 135ms | trustindex.io widget |

### INP risk assessment:
While INP can't be measured in lab, the 3+ seconds of blocking time indicates high INP risk. Any click/tap/keypress during these blocking periods will be delayed by 500-3,000ms.

---

## 5. Resource Analysis

### By Type (5,974 KB total, 179 requests)

| Type | Requests | Transfer | % Weight |
|------|----------|----------|----------|
| Images | 87 | 4,109 KB | 68.8% |
| Document (HTML) | 1 | 942 KB | 15.8% |
| JavaScript | 63 | 737 KB | 12.3% |
| Fonts | 7 | 122 KB | 2.0% |
| XHR/Fetch | 3 | 32 KB | 0.5% |
| Stylesheets | 17 | 27 KB | 0.5% |

### Key concerns:

**Document size (942 KB)**:
The SSR HTML payload is abnormally large. Likely caused by:
- Inlined `__NUXT__` JSON payload for hydration (API data serialized into the page)
- The homepage likely serializes all tour data, destination images, and translations into the initial HTML

**Image weight (4,109 KB — 68%)**:
87 image requests account for over two-thirds of all transferred bytes.

### Top oversized images:

| Image | Display Size | File Size | Wasted | Issue |
|-------|-------------|-----------|--------|-------|
| `tiktok.png` | ~24×24 icon | 152 KB | ~152 KB | 256× icon for tiny display |
| `instagram.png` | ~24×24 icon | 111 KB | ~111 KB | Same — social icon in footer |
| `youtubetwo.png` | ~32×32 icon | 128 KB | ~128 KB | Same |
| `shorts.png` | ~48×48 icon | 256 KB | ~256 KB | Footer icon |
| `certified_footer_white.png` | ~200×60 | 176 KB | ~170 KB | Footer badge |

These social media icons alone waste ~800 KB. They should be 2-5 KB SVGs.

### Third-party breakdown (diagnostic mode):

| Entity | Transfer | Impact |
|--------|----------|--------|
| sunpyramidstours.com (API) | 1,869 KB | API data, images from Laravel storage |
| r2.dev (Cloudflare R2) | 1,138 KB | Destination photos |
| Google CDN | 365 KB | Fonts, reCAPTCHA |
| trustindex.io | 121 KB | Review widget JS/CSS |

---

## 6. Render-Blocking Resources

11 render-blocking stylesheets, all from Nuxt/Vite chunking:

| File | Wasted Time |
|------|------------|
| `MakeYourTrip.80ve76IP.css` | 349ms |
| `Radio.Cyt89ugc.css` | 349ms |
| `BottomBar.8fElft_I.css` | 349ms |
| `Phone.CC7Qr-Ge.css` | 349ms |
| `Select.BjGhgeGa.css` | 349ms |
| `Text.B6rvrRBR.css` | 349ms |
| `TourCard.D9tp1F9N.css` | 349ms |
| `BlogCard.IIfpQ7hP.css` | 349ms |
| `LoadingData.xGnkkNb0.css` | 349ms |
| `swiper-vue.DJHdZmOr.css` | 349ms |
| `Button.Bq6_KQzY.css` | 349ms |

**Problem**: All components' CSS is loaded as separate blocking requests. For above-the-fold critical CSS, these should be inlined. Non-critical component CSS should be loaded with `media="print" onload="this.media='all'"`.

---

## 7. Cache & CDN Configuration

**Localhost limitation**: HTTP/2 and HTTP/3 are not available (localhost limitation).

### Cache TTL issues:

| Source | Cache TTL | Impact |
|--------|-----------|--------|
| R2 CDN (destinations) | **0 seconds** | No browser caching at all |
| Laravel storage (API) | **0 seconds** | No browser caching |
| Nuxt IPX (local images) | 60 seconds | Too short for static assets |
| Nuxt static assets | 60 seconds | Should be 1 year with content hash |

71 of 179 resources have cache TTLs below optimal thresholds. On production, Vercel edge cache + Cloudflare should mitigate this, but R2 bucket cache headers need to be configured.

---

## 8. Console Errors & Warnings

### Hydration Mismatch (Normal Mode)
```
"Hydration completed but contains mismatches."
```

This indicates the server-rendered HTML differs from what Vue renders on the client. Common causes:
- Browser-specific code in components (e.g., `navigator`, `window` access)
- Dynamic content (time, random) not wrapped in `<ClientOnly>`
- Third-party scripts modifying DOM before hydration

This is a **functional bug** that can cause:
- Incorrect event handlers
- Flickering content on page load
- Elements re-rendering unnecessarily (worsens CLS)

---

## 9. Third-Party Script Impact

| Metric | Without GTM/GA4 | With GTM/GA4 | Impact |
|--------|----------------|-------------|--------|
| Requests | 179 | 208 | +29 |
| Transfer | 5,974 KB | 6,278 KB | +304 KB |
| TBT | 3,060ms | 4,220ms | **+1,160ms** |
| LCP | 18.1s | 22.5s | **+4,400ms** |
| CLS | 0.454 | 0.454 | No change |
| Best Practices | 96 | 69 | **-27 points** |

GTM/GA4 adds significant overhead: 1.2 seconds more blocking time and 4.4 seconds slower LCP. This is normal — but the site should still pass CWV thresholds even with GTM enabled. The current site is so far from thresholds that GTM removal alone won't fix it.

---

## 10. Priority Fixes (ordered by CWV impact)

### Critical (blocks CWV "Good" rating)

| # | Fix | Expected Improvement | Effort |
|---|-----|---------------------|--------|
| 1 | Set explicit `width`/`height` on all images + tour cards | CLS: 0.454 → ~0.1 | 2-3 hours |
| 2 | Replace social media PNGs with inline SVGs | -800 KB transfer, -5 images | 30 min |
| 3 | Inline critical CSS, defer non-critical component CSS | FCP: -500ms, LCP: -500ms | 2-4 hours |
| 4 | Configure R2 bucket cache headers (`Cache-Control: public, max-age=31536000, immutable`) | LCP on repeat visits: -5s | 15 min (infra) |
| 5 | Fix hydration mismatch | Eliminates re-render, may improve CLS | Investigation |

### High Impact

| # | Fix | Expected Improvement | Effort |
|---|-----|---------------------|--------|
| 6 | Preload LCP image with `<link rel="preload">` | LCP: -2,000ms | 15 min |
| 7 | Add `font-display: swap` to web fonts | CLS from font swap: reduced | 5 min |
| 8 | Lazy-load below-fold images (`loading="lazy"`) | FCP: -1,000ms | 1 hour |
| 9 | Split main bundle, dynamic import non-critical components | TBT: -500ms | 4-8 hours |
| 10 | Defer trustindex.io widget to `onload` | TBT: -100ms | 30 min |

### Production Environment Gains (not measurable locally)

| Factor | Expected TTFB | Expected LCP |
|--------|--------------|-------------|
| Vercel edge deployment | 200-500ms (vs 2,305ms local) | 8-12s |
| Cloudflare CDN for R2 | Near-instant cached assets | 5-8s |
| Vercel ISR/SSG for static pages | 50-150ms TTFB | 2-4s |

---

## 11. CWV Monitoring Recommendations

1. **Set up Vercel Analytics**: Real CWV field data via Web Vitals library
2. **Google CrUX API**: Monthly field data for `sunpyramidstours.com` origin
3. **Lighthouse CI**: Run on every PR via GitHub Actions with performance budgets:
   ```json
   {
     "budgets": [
       {
         "resourceSizes": [
           { "resourceType": "image", "budget": 2000 },
           { "resourceType": "script", "budget": 500 }
         ],
         "timings": [
           { "metric": "largest-contentful-paint", "budget": 4000 },
           { "metric": "cumulative-layout-shift", "budget": 0.1 }
         ]
       }
     ]
   }
   ```
4. **RUM**: Consider `@nuxtjs/web-vitals` or manual `web-vitals` library integration

---

**Report generated via Lighthouse CLI 12.x lab audit against Dockerized Nuxt 3 SSR**
**Production assessment requires CrUX field data or RUM integration**
