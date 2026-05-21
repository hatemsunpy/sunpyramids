# Quickstart: Image Optimization

**Feature**: Image Optimization (007-image-optimization)
**Date**: 2026-05-21

## Prerequisites

- Node.js (matching project's `.nvmrc` or current LTS)
- `npm install` already run
- Git branch: `007-image-optimization`

## Setup

No additional dependencies required. `@nuxt/image` is already installed and configured with ipx provider.

## Development Workflow

### 1. Convert PNG Images to WebP

Use `cwebp` or `sharp` to convert PNG files >100KB in `/public/images/`:

```bash
# Using cwebp (if installed)
cwebp -q 80 public/images/mainBanner.png -o public/images/mainBanner.webp

# Or using sharp via a Node.js script
node scripts/convert-images.js
```

### 2. Update Component References

For each converted image, find and update all references:

```bash
# Search for references to a PNG file
grep -r "mainBanner.png" components/ pages/ layouts/ assets/ --include="*.vue" --include="*.scss" --include="*.css"
```

Update references:
- Vue templates: change `src="/images/mainBanner.png"` → `src="/images/mainBanner.webp"`
- CSS: change `background-image: url(/images/mainBanner.png)` → `url(/images/mainBanner.webp)`
- If using `<NuxtImg>`, ensure `format="webp"` is set or rely on the global config

### 3. Add Image Optimization Attributes

In `components/Home/MainBanner/index.vue`:
```vue
<img
  :src="item"
  :alt="'main-banner-images-' + index"
  :loading="index === 0 ? 'eager' : 'lazy'"
  :fetchpriority="index === 0 ? 'high' : 'auto'"
  :decoding="index === 0 ? 'auto' : 'async'"
  width="1920"
  height="1080"
/>
```

In `components/Shared/TourCard.vue`:
```vue
<img
  :src="img"
  :alt="props.item?.title ? props.item?.title + ' image' : 'Tour image'"
  :loading="img === props.item?.gallery[0] ? 'eager' : 'lazy'"
  width="400"
  height="194"
  decoding="async"
  style="aspect-ratio: 400/194;"
/>
```

### 4. Verify Build

```bash
npm run build
```

Ensure no build errors and all images load correctly.

### 5. Run Lighthouse Audit

```bash
# Generate static build
npm run generate

# Or test the dev server
npm run dev
```

Run Lighthouse in Chrome DevTools:
1. Open Chrome DevTools → Lighthouse tab
2. Select "Mobile" device
3. Check "Performance" category
4. Click "Analyze page load"

**Targets**:
- LCP < 2.5s on mobile
- CLS < 0.05
- Total image payload reduced by ≥80%

### 6. Manual Verification Checklist

- [ ] Homepage hero banner loads quickly on throttled connection
- [ ] No layout shift when tour card images load
- [ ] All converted images display correctly
- [ ] No 404 errors for removed PNG files
- [ ] API images (tour galleries, blog images) still load correctly
- [ ] Alt text present on all images

## Rollback

If issues are found:
1. Revert the specific component change or image conversion
2. Restore the original PNG file if deleted prematurely
3. Re-run build and verify

## Verification Commands

```bash
# Check for remaining large PNG files
find public/images -name "*.png" -size +100k

# Check for broken image references
npm run build 2>&1 | grep -i "error\|cannot find\|not found"

# Lint
npm run lint
```
