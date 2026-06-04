# Tasks: Third-Party Script Deferral

**Input**: Design documents from `/specs/009-third-party-script-deferral/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested. No automated test tasks. All verification is manual (build + visual inspection).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Baseline Measurement)

**Purpose**: Establish current performance baseline before any changes

- [X] T001 Run `npm run build` and record baseline FCP/TBT metrics (optional: run Lighthouse for comparison later)
- [X] T002 [P] Run `npm run lint` and verify zero ESLint errors on the clean baseline

**Checkpoint**: Baseline metrics recorded. Ready to begin implementation.

---

## Phase 2: Foundational — Deferred Plugin Scaffold

**Purpose**: Create the unified client-only plugin that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create `plugins/third-party-scripts.client.ts` with: (a) `loaded` boolean flag to prevent duplicate injection across SPA navigations, (b) early-exit check for `?no-third-party` query param via `useRoute()`, (c) interaction event listeners (`scroll`, `click`, `touchstart`, `mousemove`, `keydown`) with `{ once: true, capture: true, passive: true }`, (d) 5-second `setTimeout` fallback, (e) `loadAllScripts()` placeholder function
- [X] T004 Add `$ensureRecaptchaLoaded` provide to `plugins/third-party-scripts.client.ts`: export a `Promise<void>` that resolves when reCAPTCHA Enterprise script is loaded (return cached promise if already loading, resolve immediately if `window.grecaptcha` exists, reject on script load error). Register it via `nuxtApp.provide('ensureRecaptchaLoaded', ensureRecaptchaLoaded)`.

**Checkpoint**: Plugin scaffold ready — interaction detection functional, no-third-party guard active. User stories can begin.

---

## Phase 3: User Story 1 - Faster FCP by Deferring Analytics & Tracking Scripts (Priority: P1) 🎯 MVP

**Goal**: Defer GTM, GA4, and reCAPTCHA Enterprise scripts until first user interaction or 5-second timeout. Remove them from the SSR HTML rendering path.

**Independent Test**: Open any page; verify no `googletagmanager.com` or `recaptcha/enterprise.js` requests in the initial network waterfall. Submit a form requiring reCAPTCHA — it must still produce a valid token. Check `curl` output confirms GTM `<noscript>` iframe remains in raw HTML.

### Implementation for User Story 1

- [X] T005 [P] [US1] In `nuxt.config.ts`, remove the reCAPTCHA script entry from the `app.head.script` array (lines 101-107: the `{ src: "https://www.google.com/recaptcha/enterprise.js?...", async: true, defer: true }` object). Keep the surrounding `script: [` array brace; remove only the reCAPTCHA object.
- [X] T006 [P] [US1] In `app.vue`, remove the GTM/GA4 `useHead()` block (lines 31-66) that injects `googletagmanager.com/gtag/js` and the inline GTM script. Preserve: line 5 `<noscript v-if="!noThirdPartyQuery" v-html="gtmIframe">`, line 21 `const noThirdPartyQuery`, and line 23 `const gtmIframe`.
- [X] T007 [US1] In `composables/recapcha.js`, wrap the `grecaptcha.enterprise.ready()` call with `await useNuxtApp().$ensureRecaptchaLoaded()`. Add try/catch: on failure, call `useNuxtApp().$toast.error("Security verification unavailable, please try again.")` and throw. On token generation failure, call `$toast.error("Security verification failed. Please try again.")`.
- [X] T008 [US1] In `plugins/third-party-scripts.client.ts`, implement `loadAllScripts()`: (1) Set `loaded = true`. (2) Remove interaction listeners. (3) Load reCAPTCHA Enterprise via `ensureRecaptchaLoaded()` (fires and forgets, errors logged). (4) Load GTM+GA4: create `gtag/js` script tag with `src="https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J"` + `async`, then inject inline GTM script replicating the logic from the removed `app.vue` useHead block (gtag config, dataLayer push, gtm.js injection).
- [X] T009 [US1] Verify SSR behavior: (a) `npm run build` passes with zero errors, (b) `curl` homepage raw HTML and confirm GTM `<noscript>` iframe is present, (c) in browser, submit forms on `/contact-us`, `/make-your-trip`, `/event/...` and confirm reCAPTCHA tokens are valid and form submissions succeed, (d) in DevTools Network tab, confirm `googletagmanager.com` and `recaptcha` requests appear only after first interaction or 5s timeout.

**Checkpoint**: Analytics and reCAPTCHA deferred — no third-party scripts in initial waterfall, forms functional, noscript preserved.

---

## Phase 4: User Story 2 - Deferred TrustIndex Widget Loading (Priority: P2)

**Goal**: Remove per-component `onMounted` TrustIndex script injections from 4 components and replace with DOM-based detection in the plugin that loads TrustIndex scripts on page idle only when their container elements exist.

**Independent Test**: On homepage, verify `cdn.trustindex.io` requests appear after page idle, not during initial load. Navigate to a page without TrustIndex (e.g., `/checkout`) and confirm zero TrustIndex network requests.

### Implementation for User Story 2

- [X] T010 [P] [US2] In `components/MarktingPages/index.vue`, remove the `trustindexContainer` ref and the entire `onMounted` block that creates and injects the TrustIndex loader script (lines ~28, ~34-43). Keep the container `<div id="home-reviews">`. Add `style="min-height: 100px"` to the container div for CLS prevention.
- [X] T011 [P] [US2] In `components/Events/index.vue`, remove the `trustindexContainer` ref and the entire `onMounted` block that creates and injects the TrustIndex loader script (lines ~45, ~51-60). Keep the container `<div id="home-reviews">`. Add `style="min-height: 100px"` to the container div for CLS prevention.
- [X] T012 [P] [US2] In `components/Event/index.vue`, remove the `trustindexContainer` ref and the entire `onMounted` block that creates and injects the TrustIndex loader script (lines ~61, ~67-71). Keep the container `<div id="home-reviews">`. Add `style="min-height: 100px"` to the container div for CLS prevention.
- [X] T013 [P] [US2] In `components/Footer/index.vue`, remove the `trustindexContainerFooterCert` ref and the entire `onMounted` block that creates and injects the TrustIndex loader-cert script (lines ~118, ~155-164). Keep the container `<div id="footer-cert">`. Add `style="min-height: 60px"` to the container div for CLS prevention.
- [X] T014 [US2] In `plugins/third-party-scripts.client.ts`, add DOM-based TrustIndex detection: (a) define `TRUSTINDEX_CONTAINERS` map: `{ 'home-reviews': 'https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e', 'footer-cert': 'https://cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a' }`, (b) define `loadedTrustIndex` Set to track injected containers, (c) define `checkTrustIndexContainers()` that iterates the map, checks `document.getElementById(id)`, and injects the script if present and not already loaded, (d) call `checkTrustIndexContainers()` via `requestIdleCallback` (with 5s `setTimeout` fallback) after page hydration.
- [X] T015 [US2] In `plugins/third-party-scripts.client.ts`, add a `useRouter()` watcher on `currentRoute` that calls `checkTrustIndexContainers()` after `nextTick()` to handle SPA navigations where new TrustIndex containers mount without a full page reload.
- [X] T016 [US2] Verify TrustIndex behavior: (a) `npm run build` passes, (b) on homepage, TrustIndex loader.js loads after idle (not in initial waterfall), (c) on `/checkout` or any tour detail page, zero `trustindex.io` requests, (d) TrustIndex widgets render identically to before — same star ratings, same review count, same styling, (e) footer certification badge renders identically.

**Checkpoint**: TrustIndex deferred and centralized — zero per-component onMounted injections, DOM-based detection functional, widgets render correctly.

---

## Phase 5: User Story 3 - Centralized Plugin Architecture (Priority: P3)

**Goal**: Ensure the plugin architecture is clean, extensible, and handles edge cases consistently. Verify cross-cutting concerns work across all third-party services.

**Independent Test**: Verify `?no-third-party` blocks ALL scripts. Verify no duplicate scripts across 5+ SPA navigations. Confirm future third-party services can be added to the plugin by appending a registration function without touching any other file.

### Implementation for User Story 3

- [X] T017 [P] [US3] Verify `?no-third-party` query param behavior: (a) load `/?no-third-party` in browser, (b) confirm zero requests to `googletagmanager.com`, `google.com/recaptcha`, or `cdn.trustindex.io` in the Network tab, (c) confirm the GTM `<noscript>` iframe is also suppressed (per the existing `v-if="!noThirdPartyQuery"` guard), (d) remove the query param, reload, and confirm scripts load after interaction as expected.
- [X] T018 [US3] Verify no duplicate scripts across SPA navigation: (a) start on homepage, (b) click through 5+ pages without browser reload, (c) inspect DevTools Elements tab for `<script>` tags — each third-party domain must appear exactly once, (d) verify `loaded` flag and `loadedTrustIndex` Set prevent re-injection.
- [X] T019 [US3] Document the plugin's extensibility pattern: add a comment block at the top of `plugins/third-party-scripts.client.ts` describing (1) how to register a new third-party script (define a load function, register in `loadAllScripts()` or `checkTrustIndexContainers()`), (2) how `no-third-party` gate works, (3) how `loaded` guard prevents duplicates, (4) how `$ensureRecaptchaLoaded` pattern can be replicated for other on-demand scripts.

**Checkpoint**: Plugin architecture clean and extensible. All cross-cutting concerns verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and edge case hardening

- [X] T020 Run the full quickstart.md verification checklist: (1) build passes, (2) no third-party scripts in initial HTML, (3) GTM noscript preserved, (4) reCAPTCHA forms work, (5) GTM/GA4 loads after interaction, (6) TrustIndex loads on idle, (7) `?no-third-party` respected, (8) no duplicate scripts on SPA nav, (9) CLS not worsened, (10) ESLint passes. (11) Measure final FCP and TBT via 5 Lighthouse mobile runs (median) and compare against the T001 baseline to confirm SC-004 (≥10% FCP) and SC-005 (≥15% TBT).
- [X] T021 Verify edge cases from spec.md: (a) submit a form requiring reCAPTCHA immediately after page load (before interaction/timeout) — form must still submit successfully, (b) verify slow-connection scenario by throttling in DevTools — scripts must not block rendering, (c) verify reCAPTCHA load failure by temporarily blocking `google.com` in DevTools — form must show user-friendly toast error, (d) verify no layout shift around TrustIndex containers after widgets load.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — P1 MVP
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — can start after Phase 2 completes, independently testable from US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 completion (verifies cross-cutting behavior across both)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — No dependencies on other stories. Delivers the core deferral mechanism.
- **User Story 2 (P2)**: Can start after Phase 2 — independently testable. TrustIndex changes are orthogonal to analytics/reCAPTCHA.
- **User Story 3 (P3)**: Depends on US1 + US2 being complete — validates cross-cutting concerns across all services.

### Within Each User Story

- US1: T005 and T006 can run in parallel (different files: nuxt.config.ts, app.vue). T007 depends on T004 (plugin provide). T008 depends on T003+T004+T005+T006 (needs plugin scaffold + removed configs to know what to inject). T009 is verification.
- US2: T010-T013 can all run in parallel (4 different component files). T014 depends on T003 (plugin scaffold). T015 depends on T014. T016 is verification.
- US3: T017, T018 can run in parallel (different verification paths). T019 is documentation.

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **Phase 3 (US1)**: T005 and T006 can run in parallel
- **Phase 4 (US2)**: T010, T011, T012, T013 can run in parallel (all 4 components)
- **Phase 5 (US3)**: T017 and T018 can run in parallel
- **Cross-phase**: If team capacity allows, US1 and US2 can be developed in parallel after Phase 2 completes

---

## Parallel Example: User Story 2

```bash
# All 4 TrustIndex component removals can run in parallel (different files):
Task: "Remove TrustIndex onMounted from components/MarktingPages/index.vue"
Task: "Remove TrustIndex onMounted from components/Events/index.vue"
Task: "Remove TrustIndex onMounted from components/Event/index.vue"
Task: "Remove TrustIndex onMounted from components/Footer/index.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004)
3. Complete Phase 3: User Story 1 (T005-T009)
4. **STOP and VALIDATE**: Verify deferred analytics/reCAPTCHA independently
5. Site is now measurably faster (FCP/TBT improved) — deployable if desired

### Incremental Delivery

1. Setup + Foundational → Plugin scaffold ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! — analytics + reCAPTCHA deferred)
3. Add User Story 2 → Test independently → Deploy/Demo (TrustIndex also deferred)
4. Add User Story 3 → Verify cross-cutting → Deploy/Demo (clean architecture)
5. Polish → Final verification → Ship

### Single Developer Execution Order

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009
                                  ↓
                            T010 → T011 → T012 → T013 → T014 → T015 → T016
                                                                        ↓
                                                                  T017 → T018 → T019
                                                                              ↓
                                                                        T020 → T021
```

---

## Notes

- [P] tasks = different files, no dependencies — can be executed concurrently
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verification tasks (T009, T016, T017, T018, T020, T021) require a running dev server or production build
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The `$ensureRecaptchaLoaded` injection pattern can be reused for any future script that needs on-demand loading before the deferred trigger fires
