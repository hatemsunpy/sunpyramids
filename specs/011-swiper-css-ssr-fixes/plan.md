# Implementation Plan: Swiper CSS Deduplication & SSR Blocking Removal

**Branch**: `011-swiper-css-ssr-fixes` | **Date**: 2026-06-04 | **Spec**: [specs/011-swiper-css-ssr-fixes/spec.md](specs/011-swiper-css-ssr-fixes/spec.md)

**Input**: Feature specification from `/specs/011-swiper-css-ssr-fixes/spec.md`

## Summary

Complete the remaining Phase 010 performance optimization work by:
1. Centralizing Swiper CSS imports in `nuxt.config.ts` and removing ~25 duplicate per-component imports
2. Removing the immediate TrustIndex script injection from `pages/index.vue` and relying on the existing deferred third-party script plugin
3. Changing `await getnationalities()` in `components/Header/index.vue` to client-side fire-and-forget to unblock SSR

## Technical Context

**Language/Version**: Nuxt 3.15 + Vue 3 + TypeScript

**Primary Dependencies**: `nuxt-swiper` module (registered in `nuxt.config.ts`), Pinia (`sharedStore.js`), `vue3-toastify`

**Storage**: N/A (no data persistence changes)

**Testing**: Manual build inspection, Lighthouse CI, DevTools Network tab verification

**Target Platform**: Web (SSR enabled, prerendered routes)

**Project Type**: Web application — Nuxt 3 frontend + Laravel API backend

**Performance Goals**: 
- FCP improves by ≥100ms on mobile (Lighthouse) via TrustIndex deferral
- TTFB improves by ≥50ms on homepage via Header SSR unblock
- CSS bundle contains Swiper CSS exactly once (not 25+ times)

**Constraints**:
- All Swiper carousels must render identically before and after CSS deduplication
- TrustIndex widget must still render on homepage within 10s under normal conditions
- Nationality dropdowns in booking/inquiry forms must continue to populate client-side
- Must preserve crawlable links and SSR SEO metadata (Constitution Principle V)

**Scale/Scope**: Single-site Nuxt 3 app; ~25 Vue components with Swiper imports; 1 homepage with TrustIndex widget; 1 shared Pinia store for nationality data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Relevance | Status |
|-----------|-----------|--------|
| **I. Server-Rendered SEO First** | Nationality data is form-related, not page content. Removing SSR block does not affect SEO metadata rendering. | ✅ PASS |
| **V. Performance Without Sacrificing Crawlability** | TrustIndex is non-crawlable review widget; Swiper CSS is presentational; nationality data is form UI. None affect link crawlability or SEO metadata. | ✅ PASS |

**Overall**: **PASS** — No constitution violations. All changes are internal performance optimizations that do not affect SEO-critical rendering or crawlable links.

## Project Structure

### Documentation (this feature)

```text
specs/011-swiper-css-ssr-fixes/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
nuxt.config.ts                    # Global CSS array update
app.vue                         # useHead already cleaned (from Phase 009)
plugins/
└── third-party-scripts.client.ts  # Already handles TrustIndex (Phase 009)
components/
├── Header/
│   └── index.vue                 # SSR block removal target
├── Tours/LeftPanal/
│   └── Gallary.vue               # Uses <NuxtImg> (confirms image.domains needed)
├── Home/
│   └── Parteners.vue             # Uses <NuxtImg> with backend domain
├── [~25 other components with Swiper CSS imports]
pages/
└── index.vue                     # TrustIndex immediate injection removal target
stores/
└── sharedStore.js               # getnationalities() Pinia store
```

**Structure Decision**: Standard Nuxt 3 layer-0 single project. No monorepo or multi-package complexity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

None — Constitution Check passed with no violations.

---

## Phase 0: Outline & Research

### Research.md

```markdown
# Research: Swiper CSS Deduplication & SSR Blocking Removal

## Decision: Global CSS vs. Per-Component Swiper Imports
- **Chosen**: Move Swiper CSS to `nuxt.config.ts` `css` array
- **Rationale**: Nuxt/Vite deduplicates CSS imports, but having imports in ~25 components creates redundant module evaluation and makes updates harder. Global CSS is the standard pattern for framework CSS.
- **Alternatives considered**: Keep as-is (maintainability debt), dynamic import (unnecessary complexity for always-needed CSS)

## Decision: TrustIndex Deferral Strategy
- **Chosen**: Remove immediate `onMounted` injection from `pages/index.vue`; rely on existing `third-party-scripts.client.ts`
- **Rationale**: The plugin already implements `requestIdleCallback` + interaction listeners + 5s timeout + router watching + `#home-reviews` DOM detection. The immediate injection bypasses all of this.
- **Alternatives considered**: Modify plugin (unnecessary — plugin already correct), add new deferral logic (duplicate)

## Decision: Header SSR Unblock Pattern
- **Chosen**: Fire `getnationalities()` client-side without `await` during SSR
- **Rationale**: Nationality data is only needed for form dropdowns. Forms load after hydration. `await` during `<script setup>` blocks the entire SSR response.
- **Alternatives considered**: `useLazyAsyncData` (overkill — this is Pinia store data, not page data), server prefetch (defeats purpose — data is optional)
- **Pattern**: Wrap in `if (process.client)` or move to `onMounted`

## Decision: No New Contracts
- **Chosen**: Skip `/contracts/` generation
- **Rationale**: This is an internal refactoring with no external API, CLI, or library surface changes.
```

**NEEDS CLARIFICATION**: None. All technical decisions are supported by existing codebase patterns.

---

## Phase 1: Design & Contracts

### Data Model

N/A — No new entities, state transitions, or data structures. Changes are:
- CSS import location (build-time only)
- Script injection timing (runtime behavior)
- API call timing (SSR vs. client-side)

### Contracts

N/A — No external interfaces exposed or modified.

### Quickstart.md

```markdown
# Quickstart: Swiper CSS & SSR Fix Verification

## 1. Build & Inspect
```bash
npm run build
```
- Inspect `.output/public/_nuxt/*.css` — Swiper CSS should appear exactly once
- Verify no `swiper/css` strings remain in component source files

## 2. Dev Server Test — TrustIndex Deferral
```bash
npm run dev
```
- Open homepage in incognito window
- DevTools Network → filter `trustindex`
- Confirm no request until 5s idle OR user interaction
- Add `?no-third-party` → confirm no request at all

## 3. Dev Server Test — Header SSR
```bash
curl -s http://localhost:3000/ | head -20
```
- Response should return immediately (not wait for nationality API)
- Verify `<header>` renders without nationality data

## 4. Form Dropdown Test
- Navigate to any page with a booking/inquiry form
- Open nationality dropdown → should populate with countries
- If API is slow, should show loading state gracefully

## 5. Lighthouse Regression Check
```bash
npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless"
```
- FCP should improve vs. baseline
- TTFB should improve vs. baseline
- SEO score must not regress
- Zero console errors from Swiper or TrustIndex
```

---

## Phase 1 Complete — Ready for `/speckit-tasks`

**Artifacts generated**:
- `specs/011-swiper-css-ssr-fixes/plan.md` (this file)
- `specs/011-swiper-css-ssr-fixes/research.md` (Phase 0)
- `specs/011-swiper-css-ssr-fixes/data-model.md` (N/A — no data model changes)
- `specs/011-swiper-css-ssr-fixes/quickstart.md` (Phase 1)
- `specs/011-swiper-css-ssr-fixes/contracts/` (skipped — no external interfaces)

**Next**: Run `/speckit-tasks` to generate executable task breakdown.
