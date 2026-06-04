# Quickstart: Swiper CSS & SSR Fix Verification

## 1. Build & Inspect

```bash
npm run build
```

- Inspect `.output/public/_nuxt/*.css` — Swiper CSS should appear exactly once
- Verify no `swiper/css` strings remain in component source files

## 2. Dev Server Test — TrustIndex Deferral

```bash
npm run dev
```

- Open homepage in incognito window
- DevTools Network → filter `trustindex`
- Confirm no request until 5s idle OR user interaction
- Add `?no-third-party` → confirm no request at all

## 3. Dev Server Test — Header SSR

```bash
curl -s http://localhost:3000/ | head -20
```

- Response should return immediately (not wait for nationality API)
- Verify `<header>` renders without nationality data

## 4. Form Dropdown Test

- Navigate to any page with a booking/inquiry form
- Open nationality dropdown → should populate with countries
- If API is slow, should show loading state gracefully

## 5. Lighthouse Regression Check

```bash
npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless"
```

- FCP should improve vs. baseline
- TTFB should improve vs. baseline
- SEO score must not regress
- Zero console errors from Swiper or TrustIndex
