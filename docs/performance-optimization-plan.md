# Performance Optimization Plan — Sun Pyramids Tours

Based on a thorough audit of the PageSpeed Insights report and full codebase analysis, this plan addresses **7 critical performance areas** ordered by impact.

---

## Current Issues Summary

| Metric | Likely Score | Root Cause |
|--------|-------------|------------|
| **LCP** (Largest Contentful Paint) | Poor/Needs Improvement | Hero banner images from API not optimized, Swiper blocking render |
| **TBT** (Total Blocking Time) | Needs Improvement | All i18n locales loaded eagerly (`lazy: false`), heavy JS bundle |
| **CLS** (Cumulative Layout Shift) | Needs Improvement | Images without explicit dimensions, font swap flash |
| **FCP** (First Contentful Paint) | Needs Improvement | Render-blocking reCAPTCHA, third-party scripts in head |
| **Bundle Size** | Large | 7 locale files (~156KB) loaded upfront, Swiper CSS duplicated across 5+ components |

---

## Proposed Changes

### 1. 🖼️ Image Optimization (Highest Impact — LCP)

> [!CAUTION]
> **API images MUST use plain `<img>` — NOT `<NuxtImg>`.** Images fetched from the backend API (e.g., tour galleries, banners, blog featured images, highlight images) come from external CDN URLs. Proxying them through Vercel's ipx provider breaks them. A previous 33-file commit already fixed this — we must not regress.

The project has **two categories** of images with different strategies:

| Category | Example Sources | Tag to Use | Optimization Strategy |
|----------|----------------|------------|----------------------|
| **API images** | `item.gallery`, `item.featured_image`, `item.banner`, `homeData.gallery` | Plain `<img>` | `width`/`height` attrs, `loading`, `fetchpriority`, `decoding="async"`, CSS `aspect-ratio` |
| **Local images** | `/images/logo.png`, `/icons/chair.svg`, `/images/certified-logo.png` | `<NuxtImg>` | ipx handles WebP conversion, resizing, quality |

#### A) API Images — Ensure proper hints on plain `<img>` tags

##### [MODIFY] [MainBanner/index.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/components/Home/MainBanner/index.vue)
- Already correctly uses `<img>` for API gallery images ✅
- Already has `fetchpriority="high"` on first slide and preload link ✅  
- **Add** `decoding="async"` on non-first slides to avoid blocking the main thread:

```diff
  <img width="1920" height="1080" class="w-full h-full object-cover brightness-[85%]" :src="item"
    :alt="'main-banner-images-' + index" :loading="index === 0 ? 'eager' : 'lazy'"
-   :fetchpriority="index === 0 ? 'high' : 'auto'" />
+   :fetchpriority="index === 0 ? 'high' : 'auto'" :decoding="index === 0 ? 'auto' : 'async'" />
```

##### [MODIFY] [TourCard.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/components/Shared/TourCard.vue)
- Already correctly uses `<img>` for API gallery images ✅
- **Add** `decoding="async"` and ensure `style="aspect-ratio: 400/194;"` to prevent CLS:

```diff
  <img class="w-full h-full object-cover cursor-pointer" :src="img"
    :alt="props.item?.title ? props.item?.title + ' image' : 'Tour image'"
-   :loading="img === props.item?.gallery[0] ? 'eager' : 'lazy'" width="400" height="194" />
+   :loading="img === props.item?.gallery[0] ? 'eager' : 'lazy'" width="400" height="194"
+   decoding="async" style="aspect-ratio: 400/194;" />
```

##### [MODIFY] [Highlights.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/components/Home/Highlights.vue)
- Already correctly uses `<img>` for `item?.featured_image` ✅
- Verify `width`, `height`, and `loading="lazy"` are present ✅

##### Other API image components — already fixed ✅
- `SharedBlogCard.vue`, `EgyptToursCard.vue`, `EventCard.vue`, `ContactUs/MainBanner.vue`, `AboutUs/OurTeam.vue`, `Blogs/*` — all use plain `<img>` already

#### B) Local Images — Convert oversized PNGs to WebP

These are in `/public/images/` and served via `<NuxtImg>` through ipx — this is correct. But the source files are massive PNGs:

- `certified-logo.png` (560KB) → WebP (~50KB)
- `mainBanner.png` (2MB) → WebP (~200KB)  
- `wheelChair.png` (2.4MB) → WebP (~250KB)
- `authHero.png` (891KB) → WebP (~100KB)
- `logo.png` (73KB) → WebP (~15KB)
- `map.png` (819KB) → WebP (~100KB)
- `faqs-banner.png` (630KB) → WebP (~70KB)
- `heroMuseum.png` (692KB) → WebP (~80KB)
- `Cairo_Egypt_Unsplash.png` (718KB) → WebP (~80KB)

> [!IMPORTANT]
> Converting local PNGs to WebP could **reduce static image payload by ~7MB**. API images are already served from the backend CDN — their optimization must happen server-side (ask the backend team to serve WebP/AVIF from the CDN).

---

### 2. 📦 JavaScript Bundle Reduction (High Impact — TBT)

#### [MODIFY] [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts) — Enable lazy i18n loading

Currently, all 7 locale files (~156KB total) are loaded eagerly on every page:

```diff
  [
    "@nuxtjs/i18n",
    {
      locales: langsConfig,
-     lazy: false,
+     lazy: true,
      langDir: "locales/",
      defaultLocale: "en",
      detectBrowserLanguage: false,
      vueI18nLoader: true,
    },
  ],
```

This alone should reduce the initial JS bundle by ~130KB (non-English locale files).

#### [MODIFY] [vue3-toastify.js](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/plugins/vue3-toastify.js) — Make client-only

Toastify loads its CSS and JS on both server and client. Make it client-only:

- **Rename** `vue3-toastify.js` → `vue3-toastify.client.js`
- Update the reference in [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts):

```diff
- plugins: ["~/plugins/vue3-toastify.js"],
+ plugins: ["~/plugins/vue3-toastify.client.js"],
```

#### Deduplicate Swiper CSS imports
Swiper CSS is imported in **5+ components** separately (`swiper/css`, `swiper/css/pagination`, `swiper/css/navigation`). Move to a single global import in [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts):

```diff
  css: [
    "~/assets/styles/main.scss",
+   "swiper/css",
+   "swiper/css/pagination",
+   "swiper/css/navigation",
  ],
```

Then remove all `import "swiper/css"` lines from individual components.

---

### 3. 🔌 Third-Party Script Deferral (High Impact — FCP/TBT)

All third-party scripts need to stay **global** (loaded on every page), but should be **delay-loaded** to avoid blocking the initial render. The strategy: defer all scripts until **first user interaction** (scroll, click, touch) or a **timeout** (e.g., 3-5 seconds), whichever comes first.

> [!IMPORTANT]
> **Scripts to delay-load globally:** reCAPTCHA Enterprise, Google Tag Manager (GA4 + GTM), TikTok Pixel, Microsoft Clarity, Hotjar. None of these are needed for the initial paint — they can safely load after user interaction.

#### [NEW] [third-party-scripts.client.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/plugins/third-party-scripts.client.ts) — Unified delayed script loader

Create a single client-only plugin that loads **all** third-party scripts after user interaction or timeout:

```ts
export default defineNuxtPlugin(() => {
  let loaded = false

  const loadScripts = () => {
    if (loaded) return
    loaded = true

    // Remove interaction listeners once triggered
    ;['scroll', 'click', 'touchstart', 'mousemove', 'keydown'].forEach(evt =>
      window.removeEventListener(evt, loadScripts, { capture: true })
    )

    // 1. reCAPTCHA Enterprise (needed globally for forms)
    const recaptcha = document.createElement('script')
    recaptcha.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn'
    recaptcha.async = true
    document.head.appendChild(recaptcha)

    // 2. Google Tag Manager (GTM-KDF33T7) + GA4 (G-NKZ6W32C4J)
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) { window.dataLayer.push(args) }
    gtag('js', new Date())
    gtag('config', 'G-NKZ6W32C4J')

    const gtagScript = document.createElement('script')
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J'
    gtagScript.async = true
    document.head.appendChild(gtagScript)

    ;(function(w,d,s,l,i) {
      w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'})
      var f=d.getElementsByTagName(s)[0], j=d.createElement(s) as HTMLScriptElement
      var dl=l!='dataLayer'?'&l='+l:''
      j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl
      f.parentNode!.insertBefore(j,f)
    })(window,document,'script','dataLayer','GTM-KDF33T7')

    // 3. TikTok Pixel
    // Replace YOUR_TIKTOK_PIXEL_ID with your actual pixel ID
    ;(function(w,d,t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;d.getElementsByTagName("head")[0].appendChild(o)};
      ttq.load('YOUR_TIKTOK_PIXEL_ID'); // ← Replace with actual ID
      ttq.page();
    })(window, document, 'ttq')

    // 4. Microsoft Clarity
    // Replace YOUR_CLARITY_ID with your actual project ID
    ;(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r) as HTMLScriptElement;t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode!.insertBefore(t,y);
    })(window,document,"clarity","script","YOUR_CLARITY_ID") // ← Replace with actual ID

    // 5. Hotjar
    // Replace YOUR_HOTJAR_ID with your actual site ID
    ;(function(h: any,o,t,j,a?: any,r?: any){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6}; // ← Replace YOUR_HOTJAR_ID
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
  }

  // Trigger on first user interaction OR after 5s timeout
  ;['scroll', 'click', 'touchstart', 'mousemove', 'keydown'].forEach(evt =>
    window.addEventListener(evt, loadScripts, { once: true, capture: true, passive: true })
  )
  setTimeout(loadScripts, 5000)
})
```

#### [MODIFY] [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts) — Remove reCAPTCHA from head

Remove the eagerly-loaded reCAPTCHA since the plugin handles it:

```diff
  script: [
-   {
-     src: "https://www.google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn",
-     async: true,
-     defer: true,
-   },
  ],
```

#### [MODIFY] [app.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/app.vue) — Remove GTM/GA4 from useHead

Remove the entire GTM/GA4 `useHead()` block (lines 32-67) since the plugin handles it:

```diff
- useHead(() => {
-   if (route.query['no-third-party']) return {}
-   return {
-     script: [
-       { src: 'https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J', ... },
-       { children: `(function(){ function loadGtm(){...} })();`, ... }
-     ]
-   }
- })
```

> [!NOTE]
> Keep the `no-third-party` query param check — move it into the plugin:
> ```ts
> const route = useRoute()
> if (route.query['no-third-party']) return  // Skip all third-party scripts
> ```

#### [MODIFY] [index.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/pages/index.vue) — Defer TrustIndex loading

TrustIndex widget loads immediately on mount. Defer it with `requestIdleCallback`:

```diff
  onMounted(() => {
    if (process.client) {
-     const script = document.createElement('script');
-     script.src = 'https://cdn.trustindex.io/loader.js?...';
-     script.async = true;
-     script.defer = true;
-     // ...
-     if (trustindexContainer.value) {
-       trustindexContainer.value.appendChild(script);
-     }
+     const loadTrustIndex = () => {
+       const script = document.createElement('script');
+       script.src = 'https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e';
+       script.async = true;
+       script.defer = true;
+       script.setAttribute('data-type', 'stripe');
+       script.setAttribute('data-location', 'home-reviews');
+       if (trustindexContainer.value) {
+         trustindexContainer.value.appendChild(script);
+       }
+     }
+     if ('requestIdleCallback' in window) {
+       requestIdleCallback(loadTrustIndex, { timeout: 5000 });
+     } else {
+       setTimeout(loadTrustIndex, 3000);
+     }
    }
  });
```

#### Remove duplicate Vercel Speed Insights module

In `nuxt.config.ts` modules array, `@vercel/speed-insights` appears twice:
```diff
  modules: [
    // ...
    "@nuxt/image",
    "@vercel/speed-insights",
-   "@vercel/speed-insights/nuxt",
  ],
```

---

### 4. 🎨 CSS Optimization (Medium Impact — FCP)

#### [MODIFY] [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts) — Purge unused TailwindCSS

Verify `tailwind.config.js` has proper `content` paths to purge unused CSS:

#### [MODIFY] [app.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/app.vue) — Lazy-load datepicker CSS

The datepicker CSS is imported globally but only used on a few pages:

```diff
- import '@vuepic/vue-datepicker/dist/main.css'
```

Move this import to the components that actually use the datepicker (e.g., booking/checkout pages).

---

### 5. 🌊 API Waterfall Elimination (Medium Impact — LCP/FCP)

#### [MODIFY] [Header/index.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/components/Header/index.vue)

The Header calls `await getnationalities()` which **blocks the entire page render** during SSR:

```diff
- await getnationalities()
+ // Load nationalities non-blocking — not needed for initial render
+ if (process.client) {
+   getnationalities()
+ }
```

Nationalities are only needed when a user interacts with a form — no reason to block SSR for it.

#### [MODIFY] [default.vue](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/layouts/default.vue)

Similarly, `getCurrancies()` and `getSettings()` could be called non-blocking:

```diff
- getCurrancies()
- getSettings()
+ // Fire and forget — these populate Pinia stores asynchronously
+ Promise.all([getCurrancies(), getSettings()])
```

#### Parallelize homepage API calls

In the homepage flow, these calls happen **sequentially** during SSR:
1. `getnationalities()` (Header)
2. `pages/home?includes=seo` (MainBanner)  
3. `tours/home?featured=1...` (PopularDestination)
4. `tours/home?...categories.id=53` (SpecialOffers)
5. `destinations/home?...` (Highlights)

Consider using `useAsyncData` with `lazy: true` for below-the-fold sections (SpecialOffers, Highlights, TravelBlogs).

---

### 6. 🔤 Font Loading Optimization (Low-Medium Impact — CLS)

#### [MODIFY] [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts) — Add font-display: swap

The preloaded fonts don't have `font-display: swap` set in the CSS `@font-face` declarations. Verify in [main.scss](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/assets/styles/main.scss):

```css
@font-face {
  font-family: 'TripSans';
  src: url('/fonts/TripSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* ← critical for CLS */
}
```

Also, currently preloading **3 font weights**. Consider preloading only Regular and Bold, loading Medium lazily.

---

### 7. 📋 Caching & Delivery Optimization (Low Impact — Repeat Visits)

#### [MODIFY] [nuxt.config.ts](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/nuxt.config.ts) — Keep ipx for local images only

> [!WARNING]
> Do **NOT** switch to the `vercel` image provider. Since API images use plain `<img>` tags (not `<NuxtImg>`), the provider only affects **local** images from `/public/`. The `ipx` provider works correctly for local images. Switching to `vercel` would add unnecessary complexity with no benefit for API images.

Keep the current config but ensure `domains` only lists domains for `<NuxtImg>` usage (local paths):

```diff
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'avif'],
-   domains: ['sunpyramidtours.com', 'pub-5ccb6ad334fb427684d7f3fa11a34197.r2.dev'],
+   // No external domains needed — API images use plain <img>, not <NuxtImg>
  },
```

#### Existing cache headers — already good ✅
- `/_ipx/**` and `/_nuxt/**` have `max-age=31536000, immutable` — correct
- `/images/**` has `max-age=86400` — correct for local static images
- SWR rules for pages are well-configured

---

> [!IMPORTANT]
> **Tracking IDs needed**: Please provide your actual IDs for the third-party scripts plugin:
> - TikTok Pixel ID (replace `YOUR_TIKTOK_PIXEL_ID`)
> - Microsoft Clarity Project ID (replace `YOUR_CLARITY_ID`)
> - Hotjar Site ID (replace `YOUR_HOTJAR_ID`)

> [!IMPORTANT]
> **Image conversion**: Should I auto-convert the `/public/images/*.png` files to WebP format and update all references? This would permanently reduce the repo size by ~80%.

> [!IMPORTANT]
> **Backend CDN images**: Can you ask the backend team to serve images in WebP/AVIF format from the CDN? This is the only way to optimize API-fetched images since we can't proxy them through ipx/Vercel.

---

## Verification Plan

### Automated Tests
1. Run `npx nuxi build` to verify no broken imports after changes
2. Run PageSpeed Insights API before and after to measure improvement
3. Verify all pages render correctly with `npm run dev`

### Manual Verification
1. **LCP**: Verify hero banner loads fast — target < 2.5s on desktop
2. **CLS**: Verify no layout shifts when fonts load
3. **Bundle size**: Compare `_nuxt/` JS payload before/after (target 30%+ reduction)
4. **Locale loading**: Verify only the active locale file is loaded (check Network tab)
5. Re-run PageSpeed Insights on the deployed Vercel URL

### Expected Score Improvements

| Metric | Before (est.) | After (target) |
|--------|--------------|----------------|
| Performance | ~60-70 | **85-95** |
| LCP | ~3-5s | **< 2.5s** |
| TBT | ~300-500ms | **< 150ms** |
| CLS | ~0.1-0.2 | **< 0.05** |
