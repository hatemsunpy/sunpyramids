# Quickstart: PageSpeed Remediation Verification

## 1. Build & Analyze
```bash
npm run build
npx nuxt analyze
```
- Inspect the generated `.nuxt/analyze/` HTML report.
- Verify the initial JS chunk count is ≤25.
- Identify the largest vendor chunks and confirm they are not page-specific.

## 2. Image Verification
```bash
# Check a local converted image
ls -lh public/images/*.webp
# Verify srcset on a tour card
npm run dev
```
- Open any page with tour cards in DevTools.
- Inspect a card image: confirm `srcset` exists, `type="image/webp"`, and rendered size matches downloaded size.

## 3. Font Preload Verification
```bash
curl -s http://localhost:3000/ | grep -i "preload.*font"
```
- Should see three `<link rel="preload" as="font" type="font/woff2">` tags for Trip Sans weights.
- In DevTools Network tab, confirm fonts load early (before CSS images) and have `Initiator: other`.

## 4. Third-Party Script Inventory
```bash
npm run dev
```
- Open homepage → DevTools Network → filter by domain (not `localhost` or `sunpyramids.vercel.app`).
- List every third-party request. Confirm deferrable ones do not appear until after FCP or interaction.

## 5. Lighthouse Regression Check
```bash
npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless --no-sandbox"
```
- LCP ≤ 2.5 s
- FCP ≤ 1.8 s
- TBT ≤ 200 ms
- TTI ≤ 5.0 s
- Performance score ≥ 70
- CLS = 0 (no regression)
- SEO score must not regress
