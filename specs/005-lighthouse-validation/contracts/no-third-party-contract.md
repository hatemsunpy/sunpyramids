# Contract: `?no-third-party=1` Query Parameter

**Feature**: 005-lighthouse-validation | **Date**: 2026-05-12

## Purpose

Provide a diagnostic mode that suppresses third-party script injection without altering page content, SEO tags, or first-party functionality. Used exclusively for isolating third-party performance impact during Lighthouse audits.

## Trigger

- **Param**: `no-third-party` (query string)
- **Values**: Any truthy value (`1`, `true`, `yes`). Default: absent/undefined → third-party scripts load normally.
- **Example**: `https://sunpyramidstours.com/?no-third-party=1`

## Behavior Contract

### When `no-third-party` IS present:

| Script | Action |
|--------|--------|
| Google Analytics 4 (G-NKZ6W32C4J) | Suppressed |
| Google Tag Manager (GTM-KDF33T7) | Suppressed |
| Google reCAPTCHA Enterprise | Unchanged (async+defer, negligible impact) |
| Google Maps (vueGoogleMaps plugin) | Unchanged (not a script tag injection) |

### When `no-third-party` is NOT present:

All scripts load normally. No behavioral change.

### Always true (regardless of parameter):

| Property | Behavior |
|----------|----------|
| Page content | Identical |
| `<title>` | Identical |
| `<meta name="description">` | Identical |
| OG tags (`og:title`, `og:description`, `og:image`, `og:url`, etc.) | Identical |
| Twitter tags (`twitter:card`, `twitter:title`, etc.) | Identical |
| Canonical URL | Points to clean URL (no `?no-third-party`) |
| Hreflang alternates | All present, pointing to clean URLs |
| JSON-LD structured data | Identical |
| Internal `<a href>` links | Identical (clean URLs) |
| Robots meta | Identical |
| `X-Robots-Tag` header | Identical |
| noindex injection | NEVER injected |
| Sitemap inclusion | Param URLs NEVER included in sitemaps |

## Implementation Location

**File**: `app.vue`

**Method**: Wrap the existing `useHead({ script: [...] })` block (lines ~33-60) in a conditional that checks `route.query['no-third-party']`.

```ts
// Pseudocode
const route = useRoute();
const noThirdParty = computed(() => !!route.query['no-third-party']);

if (!noThirdParty.value) {
  useHead({
    script: [
      // existing GA4 + GTM scripts
    ]
  });
}
```

## Verification

1. `curl https://sunpyramidstours.com/` → HTML contains GTM/GA4 script references
2. `curl 'https://sunpyramidstours.com/?no-third-party=1'` → HTML does NOT contain GTM/GA4 script references
3. Both responses have identical: `<title>`, `<meta name="description">`, OG tags, canonical, hreflang, schema
4. Canonical on `?no-third-party=1` page = `https://sunpyramidstours.com/` (no param)

## Constraints

- Diagnostic only. Does NOT affect GATE-12 official verdict (which uses normal URL).
- Not linked from any page. Not in sitemap. Not in hreflang. Not in canonical.
- Must survive page navigation (param may be lost on client-side navigation; re-append if needed for diagnostic sessions).
