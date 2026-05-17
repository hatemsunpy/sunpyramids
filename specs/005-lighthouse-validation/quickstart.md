# Quickstart: Lighthouse Performance & SEO Validation

**Feature**: 005-lighthouse-validation | **Date**: 2026-05-12

## Prerequisites

- [x] Specs 002, 003, 004 implementations deployed to staging/production
- [x] Backend API accessible and serving dashboard SEO data
- [x] Chrome browser installed (for DevTools Lighthouse)
- [x] `curl` available in terminal
- [x] Repository access for committing the report

## One-Time Code Change

1. Edit `app.vue`: wrap the GTM/GA4 `useHead` block with a `route.query['no-third-party']` check
2. Push and deploy to the target environment

## Audit Execution Order

### Step 1: Curl Pre-Check (English Homepage)

```bash
curl -s https://sunpyramidstours.com/ | grep -E '<title>|<meta name="description"|<meta property="og:|<meta name="twitter:|<link rel="canonical"|<link rel="alternate"'
```

Verify: title, description, OG, Twitter, canonical, and hreflang tags present in raw HTML. No `<meta name="keywords">`.

### Step 2: Lighthouse — English Homepage (Mobile, Simulated 4G)

1. Open Chrome → F12 → Lighthouse tab
2. URL: `https://sunpyramidstours.com/`
3. Mode: Navigation
4. Device: Mobile
5. Categories: Performance, SEO
6. Run audit
7. Record: SEO score, Performance score, LCP, TBT, CLS

### Step 3-8: Remaining Homepage Locales

Repeat Step 2 for: `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh`

### Step 9-15: Tour Detail Pages × 7 Locales

Repeat Step 2 for: `/tour/[slug]`, `/fr/tour/[slug]`, `/de/tour/[slug]`, etc.

### Step 16-18: English Static Pages

Repeat Step 2 for: `/about-us`, `/contact-us`, `/faqs`

### Step 19: Slow 4G Throttling (English Homepage)

Same as Step 2 but set throttling to "Slow 4G" in Lighthouse settings.

### Step 20: Desktop Profile (English Homepage)

Same as Step 2 but Device: Desktop.

### Step 21: `?no-third-party=1` Diagnostic Run (English Homepage)

URL: `https://sunpyramidstours.com/?no-third-party=1`. Same settings as Step 2.

### Step 22: Cross-Browser Verification

```bash
curl -s -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' https://sunpyramidstours.com/ | grep '<title>'
curl -s -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15' https://sunpyramidstours.com/ | grep '<title>'
# Titles should match
```

### Step 23: Prefetch Validation (Homepage Network)

1. Open Chrome DevTools → Network tab
2. Filter: `Doc` (text/html documents)
3. Load: `https://sunpyramidstours.com/`
4. Verify: Exactly 1 document request

## Report Template

Fill in `docs/seo-validation/phase-5-lighthouse-validation-report.md`:

```markdown
# Phase 5 Lighthouse Validation Report

**Date**: YYYY-MM-DD
**Environment**: [staging/production URL]
**Auditor**: [name]

## Summary

| Metric | Result |
|--------|--------|
| Total audited | 17 |
| Passed | X |
| Passed with caveat | X |
| Failed | X |
| GATE-12 Verdict | PASS / FAIL |

## Per-Page Results

| # | URL | Locale | SEO | LCP | TBT | CLS | Baseline SEO | Δ SEO | Verdict |
|---|-----|--------|-----|-----|-----|-----|-------------|-------|---------|
| 1 | / | en | 100 | 2.1s | 120ms | 0.02 | 92 | +8 | PASS |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

## Third-Party Diagnostic

| URL | With Scripts | Without Scripts | Verdict |
|-----|-------------|-----------------|---------|
| / | PASS | PASS | PASS |

## Cross-Browser Verification

| Page | Chrome UA Title | Safari UA Title | Match |
|------|----------------|-----------------|-------|
| / | [title] | [title] | YES |

## Notes

- [Transient failures, reruns, third-party script impact, any observations]

## GATE-12 Final Verdict: [PASS / FAIL]
```

## Gate Criteria (from spec)

- **Pass**: SEO = 100, or ΔSEO ≥ +5, AND no CWV regression exceeding thresholds
- **Pass with caveat**: With-scripts fail, without-scripts pass (third-party impact documented)
- **Fail**: SEO below baseline, ΔSEO +1 to +4 without reaching 100, CWV regression, or both runs fail
- **GATE-12 passes**: 0 failures, all 17 combinations pass (or pass-with-caveat)
- **One transient failure**: Rerun once; if passes, record as passed with note
