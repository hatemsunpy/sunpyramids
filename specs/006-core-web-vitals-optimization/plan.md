# Implementation Plan: Core Web Vitals Optimization

**Branch**: `fix/core-web-vitals` | **Date**: 2026-05-14 | **Spec**: [spec.md](file:///d:/Sun%20Pyramids/sun%20pyramids%20tours%20-%20Web/sun-front/specs/006-core-web-vitals-optimization/spec.md)
**Input**: Feature specification from `/specs/006-core-web-vitals-optimization/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

This feature implements a comprehensive Core Web Vitals (CWV) optimization plan for the Sun Pyramids Tours Nuxt 3 frontend. The primary goal is to achieve "Good" thresholds for LCP (≤ 2.5s), CLS (≤ 0.1), and TBT/INP (≤ 200ms) on mobile emulation. The approach involves optimizing hero image loading, stabilizing layouts to prevent shifts, reducing hydration payload, and disabling excessive NuxtLink prefetching, all while strictly preserving server-rendered SEO and dashboard-driven content.

## Technical Context

**Language/Version**: JavaScript/Node 20+, Nuxt 3.15 (SSR enabled)
**Primary Dependencies**: Nuxt 3, Vercel Analytics (for field data), Lighthouse (for lab audits)
**Storage**: Cloudflare R2, Laravel Storage (API-managed media)
**Testing**: Lighthouse Mobile emulation, Browser Console (hydration checks), Network Tab (prefetch/payload audits)
**Target Platform**: Vercel (Production/Staging)
**Project Type**: Web Application (Nuxt 3 Frontend)
**Performance Goals**: LCP ≤ 2.5s, CLS ≤ 0.1, INP/TBT ≤ 200ms, FCP ≤ 1.8s, TTFB ≤ 800ms
**Constraints**: Mobile-first targeting (Mobile emulation determines pass/fail); No visual regression on booking flow
**Scale/Scope**: Homepage + 1 Representative Tour Detail Page; shared components (TourCard, BlogCard, etc.) optimized globally

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] **GATE-01 (Hydration)**: No "Hydration completed but contains mismatches" warning in browser console (SC-007, Principle I)
- [ ] **GATE-02 (Prefetch)**: Homepage load does not prefetch dozens of internal route documents (SC-008, Principle V)
- [ ] **GATE-03 (CLS)**: CLS ≤ 0.1 on mobile emulation in Lighthouse lab audit (SC-002, Principle V)
- [ ] **GATE-04 (LCP)**: LCP ≤ 2.5s on mobile emulation in Lighthouse lab audit (SC-001, Principle V)
- [ ] **GATE-05 (Links)**: All cards and navigation remain crawlable `<a href>` elements in rendered HTML (Principle IV)
- [ ] **GATE-06 (Analytics)**: Vercel Analytics enabled and collecting field data for production (SC-010)
- [ ] **GATE-07 (SEO)**: All SEO tags (canonical, hreflang, OG, schema) remain server-rendered and dashboard-driven (Principles I & II)

## Project Structure

### Documentation (this feature)

```text
specs/006-core-web-vitals-optimization/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
app.vue                 # Global layout/hydration checks
components/
├── shared/
│   ├── TourCard.vue    # CLS/Prefetch optimization
│   ├── BlogCard.vue    # CLS/Prefetch optimization
│   └── ...
├── home/
│   ├── Hero.vue        # LCP/Fetchpriority optimization
│   └── ...
pages/
├── index.vue           # Homepage optimization
└── tour/
    └── [slug].vue      # Detail page optimization
nuxt.config.ts          # Cache headers, prefetch defaults, Vercel analytics
```

**Structure Decision**: Single project layout (Nuxt 3). Optimizations will be applied directly to components and pages within the existing `components/` and `pages/` directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
