# Quickstart: Third-Party Script Deferral

**Feature**: 009-third-party-script-deferral
**Date**: 2026-05-24

## Prerequisites

- Node.js 18+
- `npm run build` passes on the clean baseline

## Verification Steps

### 1. Build Verification

```bash
npm run build
```

**Expected**: Build succeeds with zero errors. No `nuxt.config.ts` or `app.vue` parsing failures.

### 2. No Third-Party Scripts in Initial HTML

```bash
curl -s https://localhost:3000/ | grep -c "googletagmanager\|recaptcha\|trustindex"
```

**Expected**: `0` (no third-party script URLs in raw HTML)

### 3. GTM `<noscript>` Preserved

```bash
curl -s https://localhost:3000/ | grep -c "gtm-iframe\|googletagmanager.com/ns.html"
```

**Expected**: `1` (noscript iframe still present for no-JS fallback)

### 4. reCAPTCHA Forms Still Work

1. Navigate to `/contact-us`
2. Fill in the form
3. Submit immediately (before 5s timeout)
4. **Expected**: Form submits successfully with valid reCAPTCHA token. No "grecaptcha is not defined" errors in console.

### 5. GTM/GA4 Load After Interaction

1. Open DevTools Network tab
2. Navigate to homepage
3. Verify no `googletagmanager.com` requests in initial waterfall
4. Scroll or click anywhere on the page
5. **Expected**: `gtag/js` and `gtm.js` requests appear AFTER interaction

### 6. TrustIndex Loads on Idle

1. Open DevTools Network tab on homepage
2. Wait for page to fully load and become idle
3. **Expected**: `cdn.trustindex.io/loader.js` request appears after idle, not during initial load
4. Navigate to a page without TrustIndex (e.g., `/checkout`)
5. **Expected**: No `trustindex.io` requests at all

### 7. `?no-third-party` Query Param

```bash
curl -s "https://localhost:3000/?no-third-party" | grep -c "googletagmanager\|recaptcha\|trustindex"
```

**Expected**: `0`

### 8. No Duplicate Scripts on SPA Navigation

1. Navigate through 5+ pages client-side (click links, don't reload)
2. Check DevTools Elements tab for `<script>` tags
3. **Expected**: Each third-party script tag appears exactly once (no duplicates)

### 9. TrustIndex CLS Check

1. Run Lighthouse on homepage
2. **Expected**: CLS score does not worsen compared to baseline
3. Visually verify: reviews widget should not cause visible layout shift when it populates

### 10. ESLint

```bash
npm run lint
```

**Expected**: Zero errors.
