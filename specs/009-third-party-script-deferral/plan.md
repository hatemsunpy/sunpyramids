# Implementation Plan: Third-Party Script Deferral

**Branch**: `009-third-party-script-deferral` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-third-party-script-deferral/spec.md`

## Summary

Defer all non-critical third-party scripts (reCAPTCHA Enterprise, Google Tag Manager + GA4, TrustIndex widgets) from the critical rendering path by creating a single client-only Nuxt plugin that delays script loading until first user interaction, a 5-second timeout, or page idle. Remove third-party script loading from `nuxt.config.ts` head scripts, `app.vue` useHead(), and 4+ component `onMounted` hooks. Targets 10%+ FCP improvement and 15%+ TBT improvement with no visual or functional regressions.

## Technical Context

**Language/Version**: JavaScript (ESNext), TypeScript 5.x, Nuxt 3.15.0, Vue 3 (latest)
**Primary Dependencies**: @nuxtjs/i18n ^9.1.1, vue3-toastify ^0.2.8
**Storage**: N/A (no data persistence changes)
**Testing**: Manual visual verification + `npm run build` (no automated test suite exists)
**Target Platform**: Web (SSR + client-side hydration), deployed to Vercel
**Project Type**: Nuxt 3 SSR web application (tourism/travel booking)
**Performance Goals**: >=10% FCP improvement, >=15% TBT improvement, zero third-party scripts in initial page load waterfall, zero regressions in reCAPTCHA form submission, zero regressions in TrustIndex widget rendering
**Constraints**: Must preserve SSR SEO (no changes to server-rendered content), must preserve GTM `<noscript>` fallback for no-JS visitors, must respect existing `?no-third-party` query param, must not cause layout shift from deferred TrustIndex loading, must load each script exactly once per session
**Scale/Scope**: 1 new plugin file, modifications to 7 existing files (nuxt.config.ts, app.vue, composables/recapcha.js, 4 components with TrustIndex containers), 2 TrustIndex container IDs, 3 third-party services (reCAPTCHA, GTM+GA4, TrustIndex)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Server-Rendered SEO First

| Gate | Status | Notes |
|------|--------|-------|
| Translated content renders in raw HTML without JS | ✅ PASS | No changes to i18n, page templates, or SSR content rendering. Script deferral only affects client-side third-party scripts; server-rendered HTML is unchanged except for removing reCAPTCHA script tag from head and GTM inline script from useHead. Neither affects content rendering. |

### Principle II: Dashboard-Driven, Never Hardcoded

| Gate | Status | Notes |
|------|--------|-------|
| No hardcoded SEO values introduced | ✅ PASS | No SEO values are added, removed, or changed. The script IDs/site keys in the deferred plugin are the same values already present in the codebase. |

### Principle III: Multilingual Parity

| Gate | Status | Notes |
|------|--------|-------|
| All 7 locales continue to work | ✅ PASS | No i18n changes. Script deferral is language-agnostic. |
| Hreflang unaffected | ✅ PASS | No hreflang or SEO tag changes. |

### Principle IV: Crawlable Links, Never Hidden

| Gate | Status | Notes |
|------|--------|-------|
| No link structure changes | ✅ PASS | No navigation, link, or anchor changes. |

### Principle V: Performance Without Sacrificing Crawlability

| Gate | Status | Notes |
|------|--------|-------|
| Performance optimization must not damage SEO | ✅ PASS | All changes are client-side script deferral. No SEO tags, links, or navigation changes. Search engines that don't execute JS will see cleaner HTML with fewer third-party scripts. |
| NuxtLink prefetch unchanged | ✅ PASS | Existing prefetch controls are preserved. |

### Quality Gates (from Constitution)

| Gate | Relevance | Status |
|------|-----------|--------|
| GATE-01 through GATE-11 | Not directly affected | ✅ N/A — no SEO tag, link, canonical, hreflang, schema, or sitemap changes |
| GATE-12 (Lighthouse LCP/TBT) | Directly relevant | ✅ PASS — expected FCP and TBT improvement from deferred third-party scripts |

### Post-Design Re-Check (Phase 1 Complete)

| Principle | Status | Notes |
|-----------|--------|-------|
| I: SSR SEO First | ✅ PASS | Verified: reCAPTCHA script removed from nuxt.config.ts head. GTM inline script removed from app.vue useHead. Neither affects server-rendered content. `<noscript>` iframe preserved. |
| II: Dashboard-Driven | ✅ PASS | Verified: only existing script IDs/site keys relocated, no new values. |
| III: Multilingual Parity | ✅ PASS | Verified: no i18n changes. |
| IV: Crawlable Links | ✅ PASS | Verified: no link changes. |
| V: Performance Without Sacrificing Crawlability | ✅ PASS | Verified: deferral only affects client-side scripts. Crawlers receive cleaner HTML. |

### Constitution Verdict

**All gates pass.** No violations or complexity tracking entries needed. This feature is a pure performance optimization that aligns with Principle V.

## Project Structure

### Documentation (this feature)

```text
specs/009-third-party-script-deferral/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── plugin-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
# Files to CREATE (1 new)
plugins/
└── third-party-scripts.client.ts    # NEW: unified deferred script loader

# Files to MODIFY (7 existing)
nuxt.config.ts                       # Remove reCAPTCHA from app.head.script
app.vue                              # Remove GTM/GA4 useHead() block (lines 31-66), keep noscript + noThirdPartyQuery
composables/recapcha.js              # Add await $ensureRecaptchaLoaded() with error handling
components/MarktingPages/index.vue   # Remove TrustIndex onMounted script injection, keep container div with min-height
components/Footer/index.vue          # Remove TrustIndex onMounted script injection, keep container div with min-height
components/Events/index.vue          # Remove TrustIndex onMounted script injection, keep container div with min-height
components/Event/index.vue           # Remove TrustIndex onMounted script injection, keep container div with min-height
```

**Structure Decision**: Single-project Nuxt 3 SSR web application. All changes are within the existing `plugins/`, `composables/`, `components/`, and root config files. No new directories needed.

## Complexity Tracking

> No violations. Table is empty.
