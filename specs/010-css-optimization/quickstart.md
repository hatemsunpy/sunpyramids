# Quickstart: CSS Optimization

**Feature**: 010-css-optimization
**Date**: 2026-05-25

## Prerequisites

- Node.js 18+
- `npm run build` passes on clean main

## Setup

```bash
# 1. Install new dependencies
npm install --save-dev beasties @fullhuman/postcss-purgecss

# 2. Verify build passes before making changes
npm run build
```

## Implementation Steps (High-Level)

### Step 1: Unused CSS Purging (P3 — lowest risk)

```bash
# After configuring postcss.config.js (see contracts/css-optimization-contracts.md):
npm run build
# Verify: no build errors, dev server CSS coverage improved
```

### Step 2: Route-Level CSS Splitting (P2)

1. Remove Swiper CSS imports from `nuxt.config.ts` `css:` array
2. Add `import 'swiper/css'` (and sub-modules) to components that use Swiper
3. Rebuild and verify route-specific CSS chunks in `dist/_nuxt/`

### Step 3: Critical CSS Inlining (P1 — highest impact)

1. Create `modules/critical-css.ts` using the beasties integration
2. Configure route whitelist and cookie-based cache detection
3. Rebuild and verify inline CSS in HTML source for static pages

## Verification Checklist

- [ ] `npm run build` passes with zero errors
- [ ] CSS coverage audit: unused CSS under 10% on homepage
- [ ] Swiper CSS absent from `/contact-us` page network waterfall
- [ ] Static pages (/, /tours, /about-us) have inline CSS in `<head>`
- [ ] `curl -H "Cookie: css-cached=true" <url>` returns no inline CSS (cache respected)
- [ ] Visual regression check: all 7 locales, all page types render correctly
- [ ] FCP improved ≥8% vs baseline (5 Lighthouse mobile runs, median)
- [ ] Total CSS transferred decreased ≥30% vs baseline
- [ ] Build time increase ≤30 seconds

## Baseline Capture

Before starting, record the current CSS size:

```bash
npm run build
# Note CSS file sizes in dist/_nuxt/
# Run 5 Lighthouse mobile runs on homepage, record median FCP
```
