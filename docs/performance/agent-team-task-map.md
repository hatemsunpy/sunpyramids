# Agent Team Task Map — Sun Pyramids Tours Performance & SEO

**Date:** 2026-06-15  
**Branch:** `fix/vercel-deploy-fixes`  
**Lead:** Agent Team Lead  
**Context:** `CLAUDE.md` + `specs/012-performance-followup/plan.md`

---

## Executive Summary

The codebase has already completed most of the high-impact performance work from Phase 12 (`specs/012-performance-followup/`): vendor chunking, lazy BTF components, WebP conversion, LCP hero preload, font preloads, and third-party script deferral.

The remaining risks cluster around **SSR/hydration stability**, **completion of the final Lighthouse regression gate**, and **cleanup of leftover PNG references**. This task map targets those gaps without re-introducing large architectural changes.

**Recommended first sprint:** Sprint A — Hydration quick fixes + final Lighthouse gate.

---

## Agent 1 — Technical SEO Architect

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | `pages/index.vue` homepage SEO is commented out and delegated to `components/Home/MainBanner/index.vue`. This is fragile: the SEO call lives deep in a child component and could be lost if the component is refactored. | Medium | `pages/index.vue:49-60`, `components/Home/MainBanner/index.vue:84-89` |
| 2 | No obvious public `<meta name="keywords">` tag found. Dashboard field exists but is not rendered publicly. | None | — |
| 3 | Sitemap and hreflang helpers already use `https://sunpyramidstours.com`. Backend API uses `https://sunpyramidtours.com`. Separation is correct. | N/A | `server/utils/sitemap-helpers.ts:4`, `utils/seo.js`, `composables/useSeo.js` |

### Relevant Files

- `composables/useSeo.js`
- `utils/seo.js`
- `server/utils/sitemap-helpers.ts`
- `server/routes/sitemap*.xml.ts`
- `pages/index.vue`
- `components/Home/MainBanner/index.vue`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| SEO-1 | Move homepage `addSeo()` call from `MainBanner` back to `pages/index.vue` after fetching `pages/home?includes=seo`, keeping `useSeo` as the single source of truth. | Small | Proposed |
| SEO-2 | Verify all canonical/hreflang/og:url output uses `https://sunpyramidstours.com` via server-rendered HTML curl test. | Small | Proposed |
| SEO-3 | Confirm no public `<meta name="keywords">` appears in raw HTML after any changes. | Small | Proposed |

### Dependencies

- Blocks on: none.
- Blocks: none major; coordinated with Performance to ensure moving SEO call does not delay LCP resources.

### Risks

- Moving the SEO fetch to the page could change the SSR data waterfall if not awaited correctly.
- Child component may currently rely on `homeData` being loaded for both SEO and banner; refactor carefully.

### Testing Requirements

- `curl -s http://localhost:3000/ | grep -E 'canonical|hreflang|og:url'`
- `curl -s http://localhost:3000/ | grep -i 'meta name="keywords"'` should return nothing.
- Playwright SEO smoke test if one exists.

---

## Agent 2 — Core Web Vitals Performance Engineer

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Baseline Lighthouse mobile is poor: LCP 9.3 s, FCP 3.3 s, TBT 890 ms, TTI 12.1 s (`specs/012-performance-followup/baseline-lighthouse.json`). | High | Baseline report |
| 2 | Phase 12 manualChunks and lazy components are implemented, but final regression audit (T035) is still open. | High | `nuxt.config.ts`, `pages/index.vue` |
| 3 | `components/Shared/TourCard.vue` uses `NuxtImg` with fixed `width="400" height="194"` but no `sizes` prop; rendered size varies across breakpoints. | Medium | `components/Shared/TourCard.vue:9-10` |
| 4 | `components/Home/MainBanner/index.vue` LCP image is preloaded via `useHead`, but first slide `fetchpriority="high"` is set correctly. | Low | Already implemented |
| 5 | `NuxtLink :prefetch="false"` is used on tour cards, but `nuxt.config.ts` already disables global prefetch. Verify no duplicate prefetch flood. | Low | `components/Shared/TourCard.vue:8`, `nuxt.config.ts:21-26` |

### Relevant Files

- `nuxt.config.ts`
- `pages/index.vue`
- `components/Home/MainBanner/index.vue`
- `components/Shared/TourCard.vue`
- `specs/012-performance-followup/baseline-lighthouse.json`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| CWV-1 | Complete T035: run Lighthouse mobile regression audit on homepage and one representative tour detail page. Record before/after in `docs/performance/core-web-vitals-validation-report.md`. | Medium | Open |
| CWV-2 | Add responsive `sizes` prop to `TourCard` `NuxtImg` so mobile does not download 400 px images when rendered smaller. | Small | Proposed |
| CWV-3 | Verify tour detail page (e.g., `pages/tour/[id].vue` or `pages/egypt-tours/one-day-tours/[slug].vue`) has explicit image dimensions/aspect-ratio and LCP preloading where applicable. | Small | Proposed |
| CWV-4 | Review route prefetch behavior in DevTools Network; confirm no document prefetch flood on card grids. | Small | Proposed |

### Dependencies

- Blocks on: SSR/hydration fixes (SSR-1..3) to ensure clean Lighthouse runs without mismatch warnings.
- Blocks: final QA gate.

### Risks

- Adding `sizes` incorrectly can cause blurry images on desktop.
- Lighthouse on local dev may differ from Vercel edge; official verdict should target deployed URL.

### Testing Requirements

- `npx lighthouse http://localhost:3000 --preset=mobile --output=json`
- `npx lighthouse <tour-detail-url> --preset=mobile --output=json`
- DevTools Network: filter `_nuxt` and document prefetch requests.

---

## Agent 3 — Nuxt SSR & Hydration Specialist

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | `components/UI/Text.vue:135` uses `Date.now()` for `specialID`, causing different SSR/client IDs → hydration mismatch. | High | `components/UI/Text.vue:135` |
| 2 | `components/UI/Phone.vue:125` uses `Date.now()` for `specialID`, same mismatch risk. | High | `components/UI/Phone.vue:125` |
| 3 | `components/Shared/DropDown.vue:47` uses `Math.random()` for checkbox `id`, same mismatch risk. | High | `components/Shared/DropDown.vue:47` |
| 4 | `components/Shared/IceFalling.vue` uses `Math.random()` for snowflake styles during render (seasonal component, may be unused currently). | Medium | `components/Shared/IceFalling.vue:20-33` |
| 5 | `components/UI/Pagination.vue:90-99` uses `window.innerWidth` in setup without client guard. | Medium | `components/UI/Pagination.vue` |
| 6 | `components/Header/index.vue:280-301` uses `window` inside `onMounted`; generally safe, but verify no viewport-dependent template differences. | Low | `components/Header/index.vue` |
| 7 | `Home/MainBanner/index.vue:116` uses `Date.now()` for countdown; value differs SSR/client. Timer is wrapped in `onMounted`, but initial `timer.value` is `null` and may still mismatch if displayed before mount. | Medium | `components/Home/MainBanner/index.vue:111-135` |
| 8 | `pages/index.vue:31-33` wraps `#home-reviews` in `ClientOnly`. This is acceptable because it is a non-SEO third-party widget container. | N/A | `pages/index.vue` |
| 9 | `components/Home/NeedHelp.vue:96` uses `Date.now()` + `Math.random()` for a random email in a test/dev path. | Low | `components/Home/NeedHelp.vue:96` |

### Relevant Files

- `components/UI/Text.vue`
- `components/UI/Phone.vue`
- `components/Shared/DropDown.vue`
- `components/Shared/IceFalling.vue`
- `components/UI/Pagination.vue`
- `components/Header/index.vue`
- `components/Home/MainBanner/index.vue`
- `components/Home/NeedHelp.vue`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| SSR-1 | Replace `Date.now()` ID generation with deterministic ID (e.g., `useId()` or prop-based slug + increment) in `Text.vue` and `Phone.vue`. | Small | Proposed |
| SSR-2 | Replace `Math.random()` checkbox ID in `DropDown.vue` with deterministic prop-based ID. | Small | Proposed |
| SSR-3 | Guard `Pagination.vue` `window.innerWidth` with `process.client` or move to `onMounted`. | Small | Proposed |
| SSR-4 | Verify `IceFalling.vue` is only rendered client-side (already likely seasonal); if rendered server-side, move random style generation to `onMounted`. | Small | Proposed |
| SSR-5 | Review `Home/MainBanner` countdown timer for SSR/client mismatch; ensure initial SSR value matches client initial render. | Small | Proposed |
| SSR-6 | Run a full hydration mismatch console check across homepage and tour detail page. | Small | Proposed |

### Dependencies

- Blocks on: none.
- Blocks: CWV-1 Lighthouse regression, QA-1 final gate.

### Risks

- Changing IDs may affect form label associations and accessibility; keep `<label :for="id">` in sync.
- Moving window-dependent logic to `onMounted` can cause a brief layout shift if dimensions affect layout.

### Testing Requirements

- `npm run dev` → open homepage and tour detail → DevTools console should show **zero** "Hydration completed but contains mismatches" warnings.
- `npx playwright test` hydration-related specs if they exist.

---

## Agent 4 — Asset Optimization Engineer

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Many local PNGs remain in `public/images/` even though WebP variants were generated (e.g., `bird.png` + `bird.webp`, `logo.png` + `logo.webp`). Old PNGs may still be referenced. | Medium | `public/images/` |
| 2 | `docs/core-web-vitals-analysis.md` flagged oversized social/footer PNGs (`tiktok.png`, `instagram.png`, `youtubetwo.png`, `shorts.png`, `certified_footer_white.png`) wasting ~800 KB. Some may still be in use. | High | Footer/partner components |
| 3 | `contactForm.png`, `google.png`, `linkedinLogo.png`, `whatsapp.png`, `makeYourTripImage.png`, `map-location.png` are still PNG and have no WebP variant. | Medium | `public/images/` |
| 4 | `components/Shared/TourCard.vue` uses `NuxtImg` for API images. This is acceptable when domains are whitelisted, but must be verified that it does not break external CDN images. | Low | `components/Shared/TourCard.vue` |

### Relevant Files

- `public/images/`
- `components/Shared/TourCard.vue`
- `components/Footer/index.vue`
- `components/Home/Parteners.vue`
- `docs/core-web-vitals-analysis.md`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| ASSET-1 | Audit all component/CSS references to the flagged PNGs; replace footer social icons and partner logos with SVG or existing WebP variants. | Medium | Proposed |
| ASSET-2 | Convert remaining large PNGs (`contactForm.png`, `makeYourTripImage.png`, `map-location.png`) to WebP quality 80 and update references. | Small | Proposed |
| ASSET-3 | Remove original PNGs after references are updated and verified (keep PNG fallback only if explicitly required). | Small | Proposed |
| ASSET-4 | Verify no 404s after conversions with `npm run build && npm run preview`. | Small | Proposed |

### Dependencies

- Blocks on: none.
- Blocks: CWV-1 final Lighthouse if image weight still high.

### Risks

- Deleting PNGs before verifying all references causes 404s.
- Partner logos provided by API/dashboard should not be modified; only local source assets.

### Testing Requirements

- `grep -R "\.png" --include="*.vue" --include="*.scss" --include="*.css" public/ components/`
- Build + preview visual regression check.
- Lighthouse "Properly size images" audit should improve.

---

## Agent 5 — CSS Optimization Specialist

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Swiper CSS is already centralized in `nuxt.config.ts` ✅. No duplicate Swiper imports detected in current config. | N/A | `nuxt.config.ts:37-44` |
| 2 | Datepicker CSS (`@vuepic/vue-datepicker`) may still be loaded globally. Some datepicker overrides live in `app.vue` styles. | Low | `app.vue:32-88`, `nuxt.config.ts` |
| 3 | No per-page critical CSS extraction is implemented. For top-level static pages, inlining critical CSS could help FCP. | Medium | Out of current phase scope per plan |

### Relevant Files

- `nuxt.config.ts`
- `app.vue`
- `assets/styles/main.scss`
- `tailwind.config.js`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| CSS-1 | Confirm `@vuepic/vue-datepicker` CSS is only imported where used; if global, move to consuming components. | Small | Proposed |
| CSS-2 | Verify Tailwind content paths are complete and purge CSS is not over-purging. | Small | Proposed |
| CSS-3 | Defer per-page critical CSS extraction to a future phase; document as skipped in validation report. | N/A | Skipped |

### Dependencies

- Blocks on: none.
- Blocks: CWV-1 if render-blocking CSS remains high.

### Risks

- Moving CSS to components can cause missing styles if component usage is broader than expected.

### Testing Requirements

- DevTools Coverage tab on homepage to identify unused CSS.
- `npx lighthouse` "Reduce unused CSS" audit.

---

## Agent 6 — Third-Party Scripts & Widgets Engineer

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | `plugins/third-party-scripts.client.ts` already implements: `?no-third-party` gate, reCAPTCHA on-demand, GTM/GA4 deferred until interaction/5 s timeout, TrustIndex DOM detection via `#home-reviews`/`#footer-cert`, router watcher for SPA navigations. | N/A | `plugins/third-party-scripts.client.ts` |
| 2 | `pages/sustainability.vue` appears to inject TrustIndex directly in `onMounted` rather than relying on the plugin. This bypasses the deferral strategy and the `?no-third-party` gate. | Medium | `pages/sustainability.vue:15-31` |
| 3 | No additional third-party scripts (TikTok, Clarity, Hotjar) were actually found in the codebase beyond the ones the plugin handles. | N/A | Inventory complete |

### Relevant Files

- `plugins/third-party-scripts.client.ts`
- `pages/sustainability.vue`
- `pages/index.vue`
- `app.vue`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| 3P-1 | Remove direct TrustIndex injection in `pages/sustainability.vue` and rely on the deferred plugin by adding/keeping `#home-reviews` container. | Small | Proposed |
| 3P-2 | Verify `?no-third-party=1` suppresses all third-party requests on homepage, about-us, and sustainability pages. | Small | Proposed |
| 3P-3 | Confirm TrustIndex widgets still render within 10 s under normal conditions. | Small | Proposed |

### Dependencies

- Blocks on: none.
- Blocks: QA-1 final gate, CWV-1 Lighthouse.

### Risks

- Sustainability page may have different container requirements; verify widget still renders after removing direct injection.

### Testing Requirements

- `npx playwright test tests/third-party-deferral.spec.ts`
- `npx playwright test tests/trustindex-widget.spec.ts`

---

## Agent 7 — QA, Lighthouse & Release Gate Manager

### Confirmed Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Final Phase 12 Lighthouse regression (T035) is open and no current `docs/performance/core-web-vitals-validation-report.md` exists. | High | `specs/012-performance-followup/tasks.md:130` |
| 2 | Existing Playwright tests cover TrustIndex, reCAPTCHA, WebP images, font loading, third-party deferral, and performance audit. | N/A | `tests/*.spec.ts` |
| 3 | Baseline Lighthouse JSON exists but is from 2026-06-04; after recent fixes, an updated run is needed. | Medium | `specs/012-performance-followup/baseline-lighthouse.json` |

### Relevant Files

- `specs/012-performance-followup/baseline-lighthouse.json`
- `docs/seo-validation/core-web-vitals-analysis.md`
- `tests/*.spec.ts`
- `package.json`

### Implementation Tasks

| ID | Task | Complexity | Status |
|----|------|------------|--------|
| QA-1 | Create/update `docs/performance/core-web-vitals-validation-report.md` with audit date, environment, URLs, before/after metrics, deltas, and final verdict. | Medium | Proposed |
| QA-2 | Run Lighthouse mobile on homepage (`/`) and one representative tour detail page (suggest `/tour/[id]` or `/egypt-tours/one-day-tours/[slug]`). | Small | Proposed |
| QA-3 | Run `npx playwright test` and document any failures. | Small | Proposed |
| QA-4 | Verify booking/contact forms still submit and nationality dropdowns populate. | Small | Proposed |
| QA-5 | Verify no route document prefetch flood in DevTools Network. | Small | Proposed |

### Dependencies

- Blocks on: SSR-1..6, 3P-1, CWV-1, ASSET-1..4.
- Blocks: release gate.

### Risks

- Running Lighthouse against localhost may not reflect production Vercel edge performance.
- Third-party widgets may fail transiently in CI; rerun and document.

### Testing Requirements

```bash
npm run build
npm run preview
# In another terminal:
npx lighthouse http://localhost:3000 --preset=mobile --output=json --output-path=docs/performance/lighthouse-home-2026-06-15.json
npx lighthouse http://localhost:3000/egypt-tours/one-day-tours/cairo-day-tours --preset=mobile --output=json --output-path=docs/performance/lighthouse-tour-2026-06-15.json
npx playwright test
```

Official verdict uses normal URL with third-party scripts enabled. `?no-third-party=1` is diagnostic only.

---

## Recommended First Sprint

### Sprint A: Hydration quick fixes + final Lighthouse gate

**Rationale:** Phase 12’s big performance wins are already merged. The highest remaining functional risk is hydration mismatch, which also skews Lighthouse results and can re-introduce CLS. The fixes are small, targeted, and unblock the final validation gate.

**Execution order:**

1. **SSR Specialist** — SSR-1, SSR-2, SSR-3, SSR-4, SSR-5, SSR-6 (small, low risk).
2. **Third-Party Engineer** — 3P-1 (remove direct TrustIndex injection in sustainability).
3. **Asset Engineer** — ASSET-1, ASSET-2, ASSET-3, ASSET-4 (footer social PNGs → SVG/WebP).
4. **Performance Engineer** — CWV-1, CWV-2, CWV-3, CWV-4 (final Lighthouse + tour card `sizes`).
5. **SEO Architect** — SEO-1, SEO-2, SEO-3 (move homepage SEO call to page; verify domain separation).
6. **QA Manager** — QA-1..5 (validation report and release gate).

**Gate before next sprint:**

- Zero hydration mismatch console warnings on homepage and tour detail.
- `npm run build` passes.
- `npx playwright test` passes (or failures documented as transient).
- Lighthouse mobile report recorded in `docs/performance/core-web-vitals-validation-report.md`.

---

## Cross-Agent Rules (enforced)

1. Verify current code before changing it. ✅
2. Keep changes minimal and targeted. ✅
3. Do not hardcode SEO values. ✅
4. Do not break dashboard-driven SEO. ✅
5. Do not remove crawlable links. ✅
6. Do not hide SEO-critical content behind `ClientOnly`. ✅
7. Do not break multilingual routes. ✅
8. Do not break booking or contact forms. ✅
9. Do not blindly replace backend domain references. ✅
10. Public SEO URLs must use `https://sunpyramidstours.com`. ✅
11. Backend/API calls may use `https://sunpyramidtours.com`. ✅
12. Do not add trailing-slash locale redirects unless requested. ✅
13. Test after every sprint. ✅
14. Document changed files and results. ✅
