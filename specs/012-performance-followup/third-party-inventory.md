# Third-Party Script Inventory

**Date**: 2026-06-07
**Source**: `plugins/third-party-scripts.client.ts`, `nuxt.config.ts`, network analysis

---

## Inventory

| # | Name | Purpose | URL Pattern | Pages | Status | Deferral Strategy |
|---|------|---------|-------------|-------|--------|-------------------|
| 1 | **reCAPTCHA Enterprise** | Bot protection / form security | `https://www.google.com/recaptcha/enterprise.js?render=...` | Pages with forms (contact, checkout, auth) | Critical (on-demand) | `await import()` style via `ensureRecaptchaLoaded()` promise — only loads when a component explicitly requests it |
| 2 | **Google Analytics 4 (GA4)** | Traffic & conversion analytics | `https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J` | All pages | Non-critical | Deferred until first user interaction (scroll/click/touch/mousemove/keydown) or 5s fallback timeout |
| 3 | **Google Tag Manager (GTM)** | Tag container / remarketing | `https://www.googletagmanager.com/gtm.js?id=GTM-KDF33T7` | All pages | Non-critical | Loaded inline alongside GA4 after interaction/timeout |
| 4 | **TrustIndex Reviews** | Review widget / social proof | `https://cdn.trustindex.io/loader.js?...` | Homepage, Footer | Non-critical | `requestIdleCallback` + DOM detection (`document.getElementById`) — only loads if the container element exists |
| 5 | **TrustIndex Cert** | Certification badge | `https://cdn.trustindex.io/loader-cert.js?...` | Homepage, Footer | Non-critical | Same as TrustIndex Reviews |
| 6 | **@vercel/speed-insights** | Vercel performance monitoring | `@vercel/speed-insights/nuxt` module | All pages | Critical-ish | Loaded as Nuxt module at build time; renders minimal inline script |
| 7 | **Google Maps (dead code)** | Maps visualization | `https://maps.googleapis.com/maps/api/js?key=...` | **None** — unused | N/A | Plugin `vueGoogleMaps.client.ts` **removed** in this phase; no longer loaded |

---

## Deferral Status

### Already Deferred ✅
- **GA4 + GTM**: Interaction-triggered or 5s timeout
- **TrustIndex widgets**: `requestIdleCallback` + DOM presence check
- **reCAPTCHA**: On-demand promise pattern (only loads when needed)

### Not Deferrable (Intentionally) ✅
- **Vercel Speed Insights**: Build-time module, minimal runtime impact

### Removed 🗑️
- **Google Maps plugin**: Completely unused; removed from `plugins/`, `build.transpile`, `vite.ssr.noExternal`, `nitro.externals.inline`

---

## Page-Scoped Guard Opportunities

| Script | Current Behavior | Recommended Guard |
|--------|------------------|-------------------|
| reCAPTCHA | Loads on-demand when any component calls `$ensureRecaptchaLoaded()` | Already page-scoped by usage pattern |
| GA4/GTM | Loads globally on all pages after interaction | Acceptable for analytics; keep global |
| TrustIndex | Loads on homepage/footer if DOM container exists | Already scoped by `document.getElementById` check |

No additional page-scoped guards are needed — the existing deferral architecture is already well-structured.

---

## Critical Script Loading Attributes

All dynamically injected third-party scripts use `async` or `defer`:
- reCAPTCHA: `script.async = true`
- GA4: `script.async = true`
- GTM inline: `j.async=true`
- TrustIndex: `script.async = true; script.defer = true`

No parser-blocking synchronous scripts remain.

---

## Validation Checklist

- [ ] Load homepage and verify GA4/GTM do not request until interaction
- [ ] Verify TrustIndex widgets render correctly
- [ ] Verify reCAPTCHA loads correctly on contact/checkout pages
- [ ] Verify no console errors from script deferral
