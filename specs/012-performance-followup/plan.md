# Implementation Plan: PageSpeed Audit Remediation

**Branch**: `012-performance-followup` | **Date**: 2026-06-04 | **Spec**: [specs/012-performance-followup/spec.md](specs/012-performance-followup/spec.md)

**Input**: Feature specification from `/specs/012-performance-followup/spec.md`

## Summary

Raise the Lighthouse mobile Performance score from **42 to ≥70** by addressing the four highest-impact findings from the 2026-06-04 audit:

1. **JavaScript bundle reduction** — Cut initial JS script count from 62 to ≤25 via async component splitting, page-level code isolation, and vendor chunk analysis.
2. **Responsive image delivery** — Convert local images to WebP, add `srcset` width variants, and ensure API images use `NuxtImg` with format/size optimization.
3. **Font loading optimization** — Preload critical Trip Sans weights and enforce `font-display: swap`.
4. **Third-party script inventory & deferral** — Audit all external scripts, defer anything non-critical, and ensure page-scoped loading.

## Technical Context

**Language/Version**: Nuxt 3.15 + Vue 3 + TypeScript + Vite

**Primary Dependencies**: `@nuxt/image` (for responsive images), `@nuxtjs/i18n`, `vue3-toastify`, `swiper`, `@vuepic/vue-datepicker`, Pinia

**Storage**: N/A (no data persistence changes)

**Testing**: Lighthouse CI, DevTools Network/Performance tab, `npx nuxt analyze`, Playwright screenshot regression

**Target Platform**: Web (SSR enabled, prerendered routes, deployed to Vercel)

**Project Type**: Web application — Nuxt 3 frontend + Laravel API backend

**Performance Goals**:
- LCP ≤ 2.5 s on mobile (from 9.3 s)
- FCP ≤ 1.8 s on mobile (from 3.3 s)
- TBT ≤ 200 ms on mobile (from 890 ms)
- TTI ≤ 5.0 s on mobile (from 12.1 s)
- Total requests ≤ 70 (from 139)
- Total page weight ≤ 1.5 MB (from ~2.9 MB)
- JS script count ≤ 25 (from 62)

**Constraints**:
- All Swiper carousels must continue to render identically.
- TrustIndex widget and analytics must still function after deferral changes.
- Booking/inquiry form nationality dropdowns must continue to populate client-side.
- SEO metadata and crawlable links must not regress (Constitution Principle I & V).
- `font-display: swap` must not cause layout shift > 0.05 CLS.
- Images must not appear blurry or low-resolution after `srcset` changes.

**Scale/Scope**: Single-site Nuxt 3 app; ~62 JS chunks on homepage; ~303 image elements (per Lighthouse); 3 font files; unknown count of third-party scripts requiring inventory.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Relevance | Status |
|-----------|-----------|--------|
| **I. Server-Rendered SEO First** | Image `srcset` and `loading="lazy"` are presentational attributes that do not affect SEO metadata. Font preloading improves render speed without changing content. JS splitting is internal bundling. | ✅ PASS |
| **V. Performance Without Sacrificing Crawlability** | All changes are internal to asset delivery and bundling. No navigation links, canonical tags, or structured data are modified. | ✅ PASS |

**Overall**: **PASS** — No constitution violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/012-performance-followup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (if needed)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
nuxt.config.ts                    # Global CSS, plugins, build optimization settings
app.vue                           # Global imports, font preloads
assets/
├── fonts/                        # Trip Sans woff2 files (target for preloading)
└── images/                       # Local static images (target for WebP conversion)
components/
├── [~40+ Vue components]        # Targets for async component splitting
├── Home/
│   ├── HeroBanner.vue            # ATF — eager load, high-priority images
│   ├── TourCards.vue             # BTF — lazy load, srcset variants
│   ├── Highlights.vue            # BTF — lazy load
│   ├── Parteners.vue             # BTF — lazy load
│   └── TravelBlogs.vue           # BTF — lazy load
├── Tours/
│   ├── TourCard.vue              # Reused across pages — needs srcset
│   └── LeftPanal/
│       └── Gallary.vue           # Tour detail gallery — page-specific code
├── Header/
│   └── index.vue                 # Already fixed in Phase 011 for SSR block
└── [other shared components]
pages/
├── index.vue                     # Homepage — primary benchmark
├── tours/
│   └── [id].vue                  # Tour detail — page-specific lazy loading
├── blog/
│   └── [slug].vue                # Blog post — page-specific lazy loading
└── [other pages]
plugins/
├── third-party-scripts.client.ts # Existing deferral plugin (extend for new scripts)
├── vercel-analytics.client.ts    # To remove if still present (from Phase 008)
└── [other plugins]
public/
└── images/                       # Large static images (target for WebP conversion)
stores/
└── sharedStore.js                # getnationalities() Pinia store
tailwind.config.js                # Font family references
```

**Structure Decision**: Standard Nuxt 3 layer-0 single project. No monorepo.

## Complexity Tracking

None — Constitution Check passed with no violations.

---

## Phase 0: Outline & Research

### Research.md

```markdown
# Research: PageSpeed Audit Remediation

## Decision: JavaScript Code Splitting Strategy
- **Chosen**: Combine `defineAsyncComponent` for BTF sections + `vite build.rollupOptions.output.manualChunks` for vendor deduplication + page-level dynamic imports for heavy page-specific libraries.
- **Rationale**: 62 scripts indicates Vite's default chunking is creating many tiny chunks. Manual vendor chunks (grouping large node_modules into single files) and async components for BTF sections will reduce the initial request count dramatically.
- **Alternatives considered**: `nuxt-purgecss` (only removes unused CSS, not JS), webpack splitChunks (project uses Vite), single monolithic bundle (worse caching).

## Decision: Image Optimization Pipeline
- **Chosen**: Build-time WebP conversion for local `public/` images via a CLI tool (e.g., `sharp`, `cwebp`, or `nuxt-image` static generation). `NuxtImg` for API images with `format="webp"` and `sizes` prop.
- **Rationale**: The backend CDN does not support on-the-fly format conversion. Local images must be converted at build time. API images can use `NuxtImg`'s runtime URL construction if the backend supports query params; otherwise, use `srcset` with multiple backend URLs.
- **Alternatives considered**: Proxy through Vercel Image Optimization (requires `@vercel/image` and may hit limits), manual Photoshop conversion (not scalable), runtime canvas conversion (too slow).

## Decision: Font Preloading Mechanism
- **Chosen**: Use `useHead` in `app.vue` to inject `<link rel="preload">` tags for Trip Sans woff2 files. Update `tailwind.config.js` and `@font-face` declarations to include `font-display: swap`.
- **Rationale**: Nuxt's `useHead` is the standard way to inject head tags. `font-display: swap` is the simplest, most compatible strategy for eliminating FOIT.
- **Alternatives considered**: `font-display: optional` (may never load brand font on slow connections — unacceptable for brand identity), FOIT with preload only (still delays text rendering).

## Decision: Third-Party Script Inventory & Deferral
- **Chosen**: Run a full Network tab audit to list every external domain request. Classify each as Critical/Deferrable/Page-Scoped. Extend `third-party-scripts.client.ts` to cover deferrable ones. Remove unused scripts entirely.
- **Rationale**: There is no substitute for inspecting the actual runtime network requests. The existing plugin architecture from Phase 009 already supports `requestIdleCallback` + interaction triggering.
- **Alternatives considered**: New generic script deferral library (unnecessary — existing plugin works), blanket `defer`/`async` on all scripts (may break critical ones).

## Decision: No New Contracts
- **Chosen**: Skip `/contracts/` generation.
- **Rationale**: This is an internal performance refactoring with no external API, CLI, or library surface changes.
```

**NEEDS CLARIFICATION**: None. All technical decisions are supported by existing codebase patterns and the Lighthouse audit data.

---

## Phase 1: Design & Contracts

### Data Model

N/A — No new entities, state transitions, or data structures. Changes are:
- Build-time asset conversion (build pipeline only)
- Component loading strategy (runtime behavior)
- Head tag injection (runtime behavior)
- Script loading timing (runtime behavior)

### Contracts

N/A — No external interfaces exposed or modified.

### Quickstart.md

```markdown
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
```

---

## Phase 1 Complete — Ready for `/speckit-tasks`

**Artifacts generated**:
- `specs/012-performance-followup/plan.md` (this file)
- `specs/012-performance-followup/research.md` (Phase 0)
- `specs/012-performance-followup/data-model.md` (N/A)
- `specs/012-performance-followup/quickstart.md` (Phase 1)
- `specs/012-performance-followup/contracts/` (skipped)

**Next**: Run `/speckit-tasks` to generate executable task breakdown.
