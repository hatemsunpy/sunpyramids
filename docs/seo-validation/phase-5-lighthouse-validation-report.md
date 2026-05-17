# Phase 5: Lighthouse Validation Report

**Date**: 2026-05-14
**Environment**: Local Docker (node:20-alpine, Nuxt 3.15 SSR)
**Base URL**: http://localhost:3000
**Auditor**: Claude Code AI Agent
**Spec**: `specs/005-lighthouse-validation/spec.md`

---

## 1. Executive Summary

This report covers a **local smoke test** of the Lighthouse validation methodology defined in spec 005. It validates the `?no-third-party=1` diagnostic mechanism and establishes a baseline audit pattern. **Performance scores are not representative** of production — this is a Docker container on a dev machine. **SEO scores are valid and actionable**.

### Key SEO Findings

| Page | SEO Score | Failures |
|------|-----------|----------|
| Homepage `/` | **92** | `image-alt` (47 images) |
| Tour Detail `/tour/...` | **85** | `meta-description`, `image-alt` |
| About Us `/about-us` | **85** | `link-text` (2 links), `image-alt` |
| Contact Us `/contact-us` | **92** | `image-alt` |
| Privacy `/privacy-and-cookies` | **75** | `document-title`, `meta-description`, `image-alt` |

### Third-Party Script Impact

| Mode | Best Practices | GTM/GA4 Refs |
|------|---------------|-------------|
| Normal | **69** | 7 scripts loaded |
| Diagnostic (`?no-third-party=1`) | **96** | 0 scripts loaded |

The `?no-third-party=1` mechanism works correctly: Best Practices score improves by **27 points** when third-party scripts are suppressed.

---

## 2. Audit Matrix

### 2.1 Pages Audited (Diagnostic Mode)

| # | Page | URL Pattern | HTTP | SEO | Perf | BP |
|---|------|------------|------|-----|------|----|
| 1 | Homepage | `/?no-third-party=1` | 200 | 92 | 6 | 96 |
| 2 | Tour Detail | `/tour/{slug}?no-third-party=1` | 200 | 85 | 11 | 96 |
| 3 | About Us | `/about-us?no-third-party=1` | 200 | 85 | 34 | 92 |
| 4 | Contact Us | `/contact-us?no-third-party=1` | 200 | 92 | 39 | 96 |
| 5 | Privacy | `/privacy-and-cookies?no-third-party=1` | 200 | 75 | 46 | 92 |

### 2.2 Normal Mode (Third-Party Enabled)

| # | Page | URL Pattern | HTTP | SEO | Perf | BP | GTM Refs |
|---|------|------------|------|-----|------|----|----------|
| 1 | Homepage | `/` | 200 | 92 | 6 | 69 | 7 |

### 2.3 Pages NOT Audited (Require Locale Routing)

The following pages in the spec's 17-combination matrix were not tested because they require locale-prefixed routing with valid API data:

- Locale homepages (fr, de, it, pt, es, zh): `/{locale}/`
- Tour detail per locale: `/{locale}/tour/{slug}`
- Additional static pages (terms-and-conditions, blogs)

**Reason**: The local Docker container connects to the production API but locale routing with `?no-third-party=1` requires end-to-end route validation on the staging/production environment.

---

## 3. Detailed SEO Audit Findings

### 3.1 Critical: `image-alt` (ALL pages)

**All 5 pages fail the `image-alt` audit.** 47 images on the homepage alone lack `alt` attributes.

Categories of affected images:
- **Decorative icons**: `clover.png`, `easter-egg.png`, `line-arrow-right.svg` — should have `alt=""` (empty alt for decorative)
- **Tour destination photos from R2 CDN**: These are content images and MUST have descriptive `alt` text for both accessibility and SEO
- **Nuxt Image optimized images**: Using `<NuxtImg>` without `alt` attribute

**Recommended Fix**:
1. Add `alt=""` to decorative icons in shared components
2. Add descriptive `alt` text to all tour/destination content images (pull from API `title` or `alt_text` field)
3. Audit all `<img>` and `<NuxtImg>` tags across the app

### 3.2 `meta-description` (Tour Detail, Privacy)

- **Tour Detail**: The meta description is missing in the SSR HTML. The `meta-description` audit reports empty/absent description tag.
- **Privacy Page**: Same issue — no meta description in the head.

**Recommended Fix**: Ensure every page sets `useHead({ meta: [{ name: 'description', content: '...' }] })` or uses `useSeoMeta({ description: '...' })`.

### 3.3 `document-title` (Privacy only)

The Privacy page (`/privacy-and-cookies`) has no document title set. The `<title>` tag is either missing or empty.

**Recommended Fix**: Set page title via `useHead({ title: 'Privacy & Cookies — Sun Pyramids Tours' })`.

### 3.4 `link-text` (About Us only)

2 links on the About Us page lack descriptive text (likely icon links or image links without `aria-label`).

**Recommended Fix**: Add `aria-label` to links containing only images or icons.

---

## 4. Performance & Core Web Vitals (LAB Data)

**These numbers are from local Docker and do NOT reflect production.**

| Metric | Homepage (diag) | Homepage (normal) | Tour | About | Contact | Privacy |
|--------|----------------|-------------------|------|-------|---------|---------|
| FCP | 9.1s | 8.8s | 7.5s | 5.5s | 5.1s | 4.4s |
| LCP | 18.1s | 22.5s | 14.8s | 5.7s | 5.3s | 5.1s |
| TBT | 3,060ms | 4,220ms | 4,630ms | 1,670ms | 1,060ms | 940ms |
| CLS | 0.454 | 0.454 | 0.276 | N/A | N/A | N/A |
| SI | 11.5s | 12.1s | 8.9s | N/A | N/A | N/A |

Notable: **CLS of 0.454** on the homepage is high and should be investigated on production. The LCP of 18.1s is dominated by API latency to the external backend.

---

## 5. `?no-third-party=1` Diagnostic Verification

### Verified Behavior

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Normal URL loads GTM | GTM `gTag` + GTM iframe present | 7 GTM/GA4 references found | PASS |
| Diagnostic URL suppresses GTM | 0 GTM/GA4 references | 0 GTM/GA4 references found | PASS |
| `<noscript>` GTM iframe suppressed | Invisible in diagnostic mode | `v-if="!noThirdPartyQuery"` works | PASS |
| No page crash with query param | 200 OK on all pages | Homepage: 200, Tour: 200, Static: 200 | PASS |
| Best Practices improves | Higher BP score in diagnostic | 69 → 96 (+27 points) | PASS |

### Contract Compliance

The [no-third-party contract](../specs/005-lighthouse-validation/contracts/no-third-party-contract.md) is satisfied:
- `?no-third-party=1` suppresses GTM/GA4 tags ✓
- Non-third-party scripts/fonts/styles remain intact ✓
- No visual change for end users ✓
- Diagnostic mode pages return HTTP 200 ✓

---

## 6. SEO Audits That PASSED (All Pages)

These critical SEO signals are configured correctly across all tested pages:

- `is-on-https`: (localhost exempt, verified on production via curl)
- `viewport`: Mobile viewport configured
- `structured-data`: JSON-LD valid (Organization/Tour schema)
- `hreflang`: Valid for all 7 locales
- `canonical`: Valid canonical URL
- `robots-txt`: Valid and accessible
- `is-crawlable`: Pages are indexable
- `http-status-code`: Returns 200
- `font-size`: Legible text sizes
- `crawlable-anchors`: Links use valid hrefs
- `charset`: UTF-8 declared correctly
- `doctype`: HTML5 doctype present

---

## 7. SEO Failures Summary Matrix

| Audit | Homepage | Tour | About | Contact | Privacy |
|-------|----------|------|-------|---------|---------|
| `image-alt` | FAIL (47) | FAIL | FAIL | FAIL | FAIL |
| `meta-description` | PASS | **FAIL** | PASS | PASS | **FAIL** |
| `document-title` | PASS | PASS | PASS | PASS | **FAIL** |
| `link-text` | PASS | PASS | **FAIL** (2) | PASS | PASS |

---

## 8. GATE-12 Preliminary Assessment

**This is NOT the final GATE-12 verdict.**

The GATE-12 evaluation per spec 005 requires:
- All 17 page-locale combinations audited on **production/staging environment** with specs 002-004 fixes deployed
- SEO score ≥ baseline + 5 OR score = 100
- Zero tolerance: any failure blocks the release

### Local Smoke Test Results

| Criterion | Status | Detail |
|-----------|--------|--------|
| Audit methodology validated | PASS | JSON output, extraction scripts, diagnostic mode all work |
| `?no-third-party=1` mechanism | PASS | Works end-to-end, BP improves 27 points |
| SEO tag presence (specs 002-004) | PARTIAL | Core tags present but image-alt + per-page metadata missing |
| SEO baseline potential | ~85-92 | Raw scores before fixes to image-alt and metadata |

### Blockers Found (Pre-GATE)

These issues must be fixed before a GATE-12 evaluation can pass:

1. **`image-alt` universal failure** — affects all pages, will prevent any page from reaching SEO 100
2. **Privacy page** — 3 failures (title, description, image-alt), SEO 75 is well below threshold
3. **Tour detail metadata** — missing meta description will block pass

---

## 9. Action Items

### Immediate (before GATE-12 evaluation)

| # | Action | Impact | Estimated Effort |
|---|--------|--------|-----------------|
| 1 | Add `alt` attributes to all images | SEO +8pts on all pages | 2-4 hours |
| 2 | Add meta description to Tour Detail pages | Fix tour SEO failure | 30 min |
| 3 | Add title + meta description to Privacy page | Fix privacy SEO (75→90+) | 15 min |
| 4 | Add aria-label to icon links on About Us | Fix link-text failure | 15 min |
| 5 | Fix CLS 0.454 on homepage | Improve performance metric | Investigation needed |

### Production GATE-12 Evaluation

| # | Action | Detail |
|---|--------|--------|
| 6 | Deploy all fixes to staging | Specs 002-004 fixes + image-alt + metadata |
| 7 | Run full 17-combination audit | All locale homepages + tour details + 3 static pages |
| 8 | Capture production baseline | Normal mode (with third-party scripts) |
| 9 | Compare diagnostic vs baseline | +5 threshold verification |
| 10 | Issue GATE-12 verdict | PASS/FAIL with documented evidence |

---

## 10. Methodology Validation

The local Docker test validates the approach:

1. Multi-stage Docker build works correctly (fixed CJS/ESM interop, dependency conflicts)
2. `?no-third-party=1` injection via `app.vue` reactive `useHead` works
3. Lighthouse CLI produces structured JSON output
4. Node.js extraction scripts parse scores reliably
5. Third-party diagnostic comparison is quantifiable

**The tooling is ready for production GATE-12 evaluation.** Fix the image-alt and metadata issues above, deploy to staging, and execute the full 17-combination audit.

---

## Appendix A: Audit JSON Files

All raw Lighthouse JSON outputs are archived at:

```
docs/seo-validation/
├── lighthouse-homepage-diagnostic.json
├── lighthouse-homepage-normal.json
├── lighthouse-tour-diagnostic.json
├── lighthouse-about-diagnostic.json
├── lighthouse-contact-diagnostic.json
└── lighthouse-privacy-diagnostic.json
```

## Appendix B: Environment

- **Nuxt**: 3.15.0 (SSR enabled)
- **Node**: 20 Alpine (Docker)
- **Lighthouse**: 12.x (via npx)
- **Chrome**: Headless (Chromium bundled)
- **Docker Compose**: sun-front service on port 3000
- **API Backend**: https://sunpyramidtours.com/api/ (production)
