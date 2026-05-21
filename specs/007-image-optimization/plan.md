# Implementation Plan: Image Optimization

**Branch**: `007-image-optimization` | **Date**: 2026-05-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-image-optimization/spec.md`

## Summary

Convert all oversized local PNG static assets to optimized WebP (quality 80), add `decoding="async"` and explicit dimensions to API-sourced images in Vue components, and remove original PNG files after reference verification. Primary goal: reduce homepage LCP from ~3-5s to <2.5s on mobile and cut total local image payload by ≥80%.

## Technical Context

**Language/Version**: JavaScript / TypeScript (Vue 3 / Nuxt 3.15)
**Primary Dependencies**: Nuxt 3.15, Vue 3, @nuxt/image, TailwindCSS 3.4, Sass, Swiper, Pinia
**Storage**: N/A — static files served from `/public`
**Testing**: ESLint (`npm run lint`), manual Lighthouse/PageSpeed Insights
**Target Platform**: Web browsers (modern evergreen)
**Project Type**: Web application (SSR-enabled Nuxt 3)
**Performance Goals**: Homepage mobile LCP < 2.5s; total local image payload reduced ≥80% (~7MB → <1.5MB); CLS < 0.05 on pages with tour cards and hero banners
**Constraints**:
- SSR must remain intact — no changes that break server-side rendering
- API images MUST use plain `<img>` tags, NEVER `<NuxtImg>` or any server-side proxy
- Original PNGs must be deleted only after all references updated and verified
- Third-party-required PNGs (favicon, manifest, app icons) must be preserved
**Scale/Scope**: Single frontend, 7 locales, tourism booking site

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Relevant gates from the project constitution:

- **GATE-12 (Lighthouse)**: SEO score improves from baseline; LCP/TBT do not worsen.  
  **Status**: PASS — Image optimization directly improves LCP and should not affect SEO metadata or crawlability.

- **Principle V — Performance Without Sacrificing Crawlability**:  
  **Status**: PASS — Changes are limited to image attributes (`decoding`, `width`, `height`, `loading`) and static file conversion. No links are hidden or converted to JS-only handlers.

No complexity tracking required — no constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/007-image-optimization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (minimal — no external API contracts)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
components/
├── Home/
│   ├── MainBanner/
│   │   └── index.vue           # FR-001: add decoding async to non-first slides
│   ├── Highlights.vue          # FR-004: verify width/height/lazy loading
│   ├── CertificationOverview.vue
│   ├── ChairIcon.vue
│   ├── FrequentlyAsked/
│   ├── gallary.vue
│   ├── MakeYourTrip.vue
│   ├── NeedHelp.vue
│   ├── Parteners.vue
│   ├── PopularDistnation.vue
│   ├── SpecialOffers.vue
│   └── TravelBlogs.vue
├── Shared/
│   ├── TourCard.vue            # FR-002, FR-003: add aspect-ratio, decoding async
│   ├── BlogCard.vue
│   ├── EgyptToursCard.vue
│   ├── EventCard.vue
│   └── ...
├── AboutUs/
│   ├── MainBanner.vue
│   └── OurTeam.vue
├── Blogs/
│   └── Blog/MainBanner.vue
├── ContactUs/
│   └── MainBanner.vue
├── ...
pages/
├── index.vue                   # TrustIndex deferral (out of scope for this feature)
└── ...
public/
├── images/                     # FR-005, FR-006: PNG → WebP conversion target
│   ├── certified-logo.png      # 560KB → WebP
│   ├── mainBanner.png          # 2.0MB → WebP
│   ├── wheelChair.png          # 2.4MB → WebP
│   ├── authHero.png            # 891KB → WebP
│   ├── map.png                 # 819KB → WebP
│   ├── faqs-banner.png         # 630KB → WebP
│   ├── heroMuseum.png          # 692KB → WebP
│   ├── Cairo_Egypt_Unsplash.png # 718KB → WebP
│   ├── blogsHero.png           # 526KB → WebP
│   ├── giza.png                # 340KB → WebP
│   ├── certified.png           # 295KB → WebP
│   ├── aboutusmainbanner.png   # 284KB → WebP
│   ├── realLocation.png        # 248KB → WebP
│   ├── certified_footer_white.png # 183KB → WebP
│   ├── museums.png             # 182KB → WebP
│   ├── shorts.png              # 164KB → WebP
│   ├── certification.png       # 133KB → WebP
│   ├── tiktok.png              # 132KB → WebP
│   ├── cri-container.png       # 118KB → WebP
│   └── ... (remaining <100KB PNGs stay)
├── icons/                      # Small icons — evaluate for SVG replacement
└── ...
nuxt.config.ts                  # Verify image provider config (ipx, quality 80)
```

**Structure Decision**: Standard Nuxt 3 SSR web application. Image optimization touches Vue components (`components/**/*.vue`) and static assets (`public/images/`). No backend or API changes.

## Complexity Tracking

No complexity tracking required — no constitution violations detected.
