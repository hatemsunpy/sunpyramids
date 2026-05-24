# Quickstart: JavaScript Bundle Reduction

**Feature**: 008-js-bundle-reduction
**Date**: 2026-05-24

## Overview

Four targeted changes to reduce initial JS/CSS payload by ~20%+. All changes are configuration-level or import relocation — no new components, no logic changes.

## Change Summary

| # | Change | Files Touched | Risk |
|---|--------|---------------|------|
| C1 | Enable lazy i18n + fix langDir | `nuxt.config.ts` (2 lines) | Medium |
| C2 | Rename toast plugin to client-only | `plugins/vue3-toastify.js`, `nuxt.config.ts` | Low |
| C3 | Deduplicate Swiper CSS | `nuxt.config.ts`, 27 `.vue` files | Medium |
| C4 | Remove duplicate Vercel Insights | `nuxt.config.ts` (1 line) | Low |
| C5 | Scope datepicker CSS | `app.vue`, 2 components | Low |
| C6 | Delete disabled no-op plugins | Delete 2 files | None |

## Implementation Order

### Step 1: Low-Risk Changes First

**C4 — Vercel Insights dedup**:
1. In `nuxt.config.ts`, remove line with `"@vercel/speed-insights"` from modules array
2. Keep `"@vercel/speed-insights/nuxt"` 

**C6 — Delete disabled no-op plugins**:
1. Delete `plugins/vercel-analytics.client.ts`
2. Delete `plugins/clear-payload.client.ts`

**C5 — Scope datepicker CSS**:
1. Remove `import '@vuepic/vue-datepicker/dist/main.css'` from `app.vue` line 19
2. Keep the `.dp__*` and `.v3dp__*` custom CSS overrides in app.vue `<style>` block
3. Add `import '@vuepic/vue-datepicker/dist/main.css'` to:
   - `components/UI/Date.vue` (after line 32, VueDatePicker import)
   - `components/UI/Shortcuts/Date.vue` (after line 30, VueDatePicker import)

### Step 2: Toast Plugin Client-Only

**C2**:
1. Rename: `plugins/vue3-toastify.js` → `plugins/vue3-toastify.client.js`
2. In `nuxt.config.ts`, update plugin path: `~/plugins/vue3-toastify.js` → `~/plugins/vue3-toastify.client.js`

### Step 3: i18n Lazy Loading

**C1**:
1. In `nuxt.config.ts` i18n module config:
   - Change `lazy: false` → `lazy: true`
   - Change `langDir: "locales/"` → `langDir: "i18n/locales/"`
2. Implement language switch debounce in the language switcher component (prevent rapid clicks while locale fetch is in progress)
3. Add error handling for failed locale fetch (keep current language, optional toast)

### Step 4: Swiper CSS Deduplication

**C3**:
1. In `nuxt.config.ts`, add to `css` array:
   ```js
   css: [
     "~/assets/styles/main.scss",
     "swiper/css",
     "swiper/css/pagination",
     "swiper/css/navigation",
     "swiper/css/free-mode",
     "swiper/css/thumbs",
   ],
   ```
2. Remove ALL `import "swiper/css"`, `import "swiper/css/pagination"`, `import "swiper/css/navigation"`, `import "swiper/css/free-mode"`, `import "swiper/css/thumbs"` from the 27 components listed in `research.md` (Section R3).

## Verification Checklist

After all changes, verify in order:

- [ ] `npm run build` completes with zero errors
- [ ] ESLint passes with zero errors
- [ ] Homepage loads with only one locale file fetched (Network tab)
- [ ] Language switcher works: switch between all 7 languages
- [ ] Rapid language switch clicks are debounced (no flickering keys)
- [ ] Toast notifications appear and dismiss correctly
- [ ] Homepage main banner carousel renders and navigates
- [ ] Tour detail page gallery carousel renders
- [ ] Blog page carousel renders
- [ ] Events page carousels render
- [ ] Partners carousel on homepage renders
- [ ] Special Offers carousel renders
- [ ] Datepicker opens with correct styling on booking/checkout pages
- [ ] Pages without datepicker do NOT load datepicker CSS
- [ ] Vercel Speed Insights script loads (check Network tab for `/_vercel/insights/`)
- [ ] All navigation links work (click through main pages)
- [ ] SSR renders translated SEO content (view page source on homepage, check title/meta in raw HTML)

## Rollback

If any change causes issues, revert individually:

| Change | Rollback |
|--------|----------|
| C1 | Set `lazy: false` in i18n config |
| C2 | Rename plugin back to `.js`, update config |
| C3 | Re-add per-component Swiper CSS imports, remove from nuxt.config.ts css array |
| C4 | Re-add `"@vercel/speed-insights"` to modules array |
| C5 | Re-add import to app.vue, remove from components |
| C6 | Restore deleted files from git |
