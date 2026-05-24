# Research: Third-Party Script Deferral

**Feature**: 009-third-party-script-deferral
**Date**: 2026-05-24

## R1: Unified Third-Party Script Deferral Plugin

### Decision
Create a single client-only Nuxt plugin (`plugins/third-party-scripts.client.ts`) that delays loading of all third-party scripts (GTM+GA4, reCAPTCHA, TrustIndex) until either first user interaction or a 5-second timeout, whichever occurs first. Remove third-party script loading from `nuxt.config.ts`, `app.vue`, and individual component `onMounted` hooks.

### Rationale
- Three separate loading mechanisms currently exist: reCAPTCHA in `nuxt.config.ts` head scripts (always eager), GTM/GA4 in `app.vue` `useHead()` (on window load), TrustIndex across 4+ components (on mount). Each has different timing and no central control for the `no-third-party` query param.
- A unified plugin provides a single point for: load state tracking (prevent duplicates across SPA nav), `no-third-party` override, on-demand loading hooks (for reCAPTCHA when form submits before deferred trigger), and consistent timing strategy.
- Nuxt `.client` suffix ensures the plugin is excluded from SSR entirely — no server-side third-party script execution.
- Moving scripts from `nuxt.config.ts` head and `app.vue` `useHead()` to a plugin removes them from the SSR render path, reducing server-side work and eliminating render-blocking third-party resources from the initial HTML.

### Alternatives Considered
- **Keep scripts where they are but add `defer`/`async` attributes**: Already the case for reCAPTCHA and GTM — they still block bandwidth and compete for CPU during the critical period even when deferred.
- **Use Nuxt `app.head` in nuxt.config with dynamic script**: Doesn't support the interaction-based trigger; scripts still load during initial page.
- **Individual plugins per service**: Adds plugin directory noise and duplicates load-state tracking logic. A single plugin with internal registration is simpler.
- **Partytown for web worker isolation**: Adds ~60KB overhead, introduces complex CORS/proxy configuration. Overkill for 4-5 scripts. Not needed given the measured TBT targets.

### Implementation Details

1. **Create** `plugins/third-party-scripts.client.ts` with:
   - A `loaded` boolean flag to track state across SPA navigations
   - `no-third-party` query param check on init (early return if present)
   - Event listeners on `scroll`, `click`, `touchstart`, `mousemove`, `keydown` with `{ once: true, capture: true, passive: true }`
   - A 5-second `setTimeout` fallback
   - `loadAllScripts()` function that injects GTM+GA4 and reCAPTCHA scripts
   - An exported function `ensureRecaptchaLoaded()` for the reCAPTCHA composable to trigger on-demand loading
   - TrustIndex DOM-based detection: on idle, check for `#home-reviews`, `#footer-cert` containers

2. **Order of script injection** within `loadAllScripts()`:
   - reCAPTCHA first (needed by forms, loads fastest)
   - GTM+GA4 second (analytics, can wait slightly longer)
   - TrustIndex via `requestIdleCallback` (lowest priority, below fold)

3. **Remove** from `nuxt.config.ts`: the reCAPTCHA `script` entry in `app.head.script`
4. **Remove** from `app.vue`: the GTM/GA4 `useHead()` script block (lines 31-66). Preserve the `<noscript>` GTM iframe and its `no-third-party` conditional.
5. **Remove** from components: ALL `onMounted` TrustIndex `document.createElement('script')` injections from:
   - `components/MarktingPages/index.vue` (line ~34)
   - `components/Footer/index.vue` (line ~155)
   - `components/Events/index.vue` (line ~51)
   - `components/Event/index.vue` (line ~67)

---

## R2: reCAPTCHA On-Demand Loading Strategy

### Decision
The plugin loads reCAPTCHA Enterprise via the standard deferred flow (interaction or 5s timeout). The `composables/recapcha.js` composable is modified to call `ensureRecaptchaLoaded()` before attempting to use `grecaptcha`, which returns a Promise that resolves when the script is ready (either already loaded, currently loading, or triggers immediate load). On load failure, the composable rejects with an error that forms display as "Security verification unavailable, please try again."

### Rationale
- The reCAPTCHA composable is used by 5 components (ContactUs, MakeYourTrip/Form, Home/NeedHelp, Event/RightPanal/Book, MarktingPages/ContactUs). If any of these forms is submitted before the 5s timeout fires, the composable must trigger immediate script loading rather than failing.
- The current composable assumes `grecaptcha` is globally available. After deferral, this assumption breaks for early form submissions.
- A Promise-based `ensureRecaptchaLoaded()` approach lets the composable `await` readiness without polling or race conditions.
- Load failure surface: network error, ad blocker blocking google.com, or script load timeout. The fallback error message must be user-friendly and non-disruptive (toast notification).

### Alternatives Considered
- **Preload reCAPTCHA on form focus**: Adds complexity (every form needs a focus listener); form may be submitted without focusing any field (autofill).
- **Load reCAPTCHA immediately on page load (no deferral)**: Defeats the purpose of this phase — reCAPTCHA is a major render-blocking resource.
- **Use reCAPTCHA v3 score-based (no user interaction)**: Already using Enterprise which is score-based. The script load itself is what we're deferring, not the token generation.

### Implementation Details
1. Add to `plugins/third-party-scripts.client.ts`:
   ```ts
   let recaptchaPromise: Promise<void> | null = null
   
   function ensureRecaptchaLoaded(): Promise<void> {
     if (window.grecaptcha) return Promise.resolve()
     if (!recaptchaPromise) {
       recaptchaPromise = new Promise((resolve, reject) => {
         const script = document.createElement('script')
         script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn'
         script.async = true
         script.onload = () => resolve()
         script.onerror = () => reject(new Error('reCAPTCHA load failed'))
         document.head.appendChild(script)
       })
     }
     return recaptchaPromise
   }
   ```
2. Provide `ensureRecaptchaLoaded` via `useNuxtApp()` provide:
   ```ts
   nuxtApp.provide('ensureRecaptchaLoaded', ensureRecaptchaLoaded)
   ```
3. In `composables/recapcha.js`, `await useNuxtApp().$ensureRecaptchaLoaded()` before calling `grecaptcha.enterprise.execute()`
4. Wrap in try/catch; on failure, throw a descriptive error that form handlers catch and display via `$toast`

---

## R3: GTM/GA4 Relocation Strategy

### Decision
Remove the entire GTM/GA4 `useHead()` block from `app.vue` (lines 31-66) and relocate the script injection logic to the deferred plugin. The `<noscript>` GTM iframe in the template is preserved with its existing `v-if="!noThirdPartyQuery"` guard.

### Rationale
- The `useHead()` approach in `app.vue` causes GTM/GA4 scripts to be rendered into the `<head>` during SSR and loaded on window `load` event. This is earlier than necessary — these scripts are only needed for analytics/tracking, never for initial render.
- Moving to the deferred plugin eliminates GTM/GA4 from the initial HTML entirely and loads them after user interaction or timeout.
- The `<noscript>` iframe must stay because: (1) it's a text node via `v-html`, not a script, so it doesn't block rendering; (2) it provides fallback tracking for the ~1% of visitors with JS disabled; (3) it only activates when JS is disabled, so deferring it would be meaningless.
- The `no-third-party` query param check in the plugin covers both the deferred scripts AND the noscript iframe via the existing `v-if` template guard.

### Alternatives Considered
- **Keep GTM in useHead but add `defer`**: Already deferred via `window.addEventListener('load', loadGtm)`. This still puts the inline script in the SSR HTML output, adding ~700 bytes to every page's HTML.
- **Use Google Consent Mode v2**: Requires CMP integration; adds complexity. The `no-third-party` query param already serves as an opt-out mechanism.

### Implementation Details
1. Remove the `useHead()` block (lines 31-66) from `app.vue`
2. Remove the `gtmIframe` computed property if it's only used within the removed block (but it's used in template `<noscript>`, so keep the `gtmIframe` const and `noThirdPartyQuery` computed)
3. Keep lines 23 and 21 in app.vue script (the `gtmIframe` const and `noThirdPartyQuery`)
4. In the deferred plugin, replicate the GTM+GA4 script injection from the removed useHead block

---

## R4: TrustIndex DOM-Based Deferred Loading

### Decision
Instead of injecting TrustIndex scripts in each component's `onMounted`, the deferred plugin checks for known TrustIndex container IDs (`#home-reviews`, `#footer-cert`) after page idle (via `requestIdleCallback` with 5s `setTimeout` fallback). When a container exists, the corresponding TrustIndex loader script is injected. On SPA route changes, the detection re-runs.

### Rationale
- TrustIndex widgets are below the fold and non-critical for initial render. Loading them on mount adds script evaluation overhead during the critical period.
- DOM-based detection (checking for container ID presence) avoids maintaining a route registry that would need updates whenever a component adds/removes a TrustIndex widget.
- `requestIdleCallback` ensures the check runs only when the browser's main thread is idle, preventing interference with more critical post-hydration work.
- Route change detection is needed because Nuxt SPA navigation can mount new TrustIndex containers without a full page reload.

### TrustIndex Container Mapping

| Container ID | Script URL | Used In |
|---|---|---|
| `#home-reviews` | `https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e` | `components/MarktingPages/index.vue`, `components/Events/index.vue`, `components/Event/index.vue` |
| `#footer-cert` | `https://cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a` | `components/Footer/index.vue` |

### Alternatives Considered
- **IntersectionObserver for viewport detection**: More precise (loads when user scrolls near widget) but TrustIndex widgets are not always visible on initial viewport — they're further down the page. `requestIdleCallback` is simpler and achieves the same TBT benefit.
- **Keep per-component loading but use requestIdleCallback**: Doesn't centralize control; still requires the `no-third-party` check in each component.
- **Load TrustIndex in the plugin unconditionally on idle**: Would fetch TrustIndex scripts even on pages without TrustIndex widgets, wasting bandwidth.

### Implementation Details
1. In `plugins/third-party-scripts.client.ts`:
   - Define `TRUSTINDEX_CONTAINERS` map: `{ 'home-reviews': '<loader.js URL>', 'footer-cert': '<loader-cert.js URL>' }`
   - On idle (requestIdleCallback): iterate containers, check `document.getElementById(id)` with raw IDs (no `#` prefix), inject script if present and not already loaded
   - On route change (watch `useRouter().currentRoute`): re-run detection after `nextTick`
   - Track loaded scripts in a `Set<string>` to prevent duplicates

---

## R5: Interaction-Based Trigger Pattern

### Decision
Use a set of DOM events (`scroll`, `click`, `touchstart`, `mousemove`, `keydown`) with `{ once: true, capture: true, passive: true }` to detect first user interaction. Also set a 5-second `setTimeout` as a fallback for bots, crawlers, or users who land and read without interacting.

### Rationale
- This is a well-established pattern (used by Google's web.dev recommendations, Partytown, and the performance optimization plan's proposed code).
- `capture: true` ensures the listener fires even if events are consumed by child elements.
- `passive: true` ensures the scroll listener doesn't block scrolling.
- `once: true` auto-removes ALL listeners after the first interaction fires, preventing ongoing overhead.
- 5-second timeout: Analytics show most real users interact within 3-4 seconds of page load. A 5-second fallback captures the remaining sessions without excessive delay.
- These events cover all meaningful user interactions: mouse, touch, keyboard, scroll.

### Alternatives Considered
- **Only `scroll` and `click`**: Misses keyboard-only users and touchscreen users who tap without scrolling.
- **Only timeout (no interaction detection)**: Simpler but loads scripts even for users who bounce immediately, wasting bandwidth and potentially affecting metrics for quick-bounce pages.
- **Performance Observer for LCP/FCP**: Fires after paint metrics, but these fire before user interaction and would load scripts too early.

### Implementation Details
```ts
const events = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown']
function onInteraction() {
  events.forEach(evt => window.removeEventListener(evt, onInteraction, { capture: true }))
  loadAllScripts()
}
events.forEach(evt => window.addEventListener(evt, onInteraction, { once: true, capture: true, passive: true }))
setTimeout(() => {
  // Check if still not loaded (interaction may have already fired)
  if (!loaded) loadAllScripts()
}, 5000)
```
