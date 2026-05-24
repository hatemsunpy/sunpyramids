# Data Model: JavaScript Bundle Reduction

**Feature**: 008-js-bundle-reduction
**Date**: 2026-05-24

This feature has no database entities. The "data model" below documents the configuration artifacts and their relationships.

---

## Entity: Locale File

A JSON file containing translated UI strings for a single language.

### Attributes

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `code` | string (ISO 639-1) | Language code | `"en"`, `"fr"` |
| `file` | path | Filename within `langDir` | `"en.json"` |
| `iso` | string | ISO locale identifier | `"en-US"`, `"fr-FR"` |
| `dir` | string | Text direction | `"ltr"` |
| `name` | string | Display name | `"English"`, `"Français"` |
| `size` | number (KB) | File size on disk | `21.3` |

### Instances

| Code | File | ISO | Size (KB) |
|------|------|-----|-----------|
| en | en.json | en-US | 21.3 |
| fr | fr.json | fr-FR | 22.8 |
| de | de.json | de-DE | 23.4 |
| it | it.json | it-IT | 21.5 |
| pt | pt.json | pt-PT | 21.7 |
| es | es.json | es-ES | 22.8 |
| zh | zh.json | zh-CN | 19.3 |

**Total**: ~153 KB

### Loading Mode State Transition

```
BEFORE (lazy: false):                AFTER (lazy: true):
                                     
  All 7 files bundled eagerly         Active locale bundled eagerly
  into initial JS payload    ──→      Inactive locales fetched on demand
  No runtime fetches                  via $fetch when user switches lang
```

### Validation Rules

- Each locale file MUST contain valid JSON
- Each locale file MUST have the same key structure (no missing keys per locale)
- `langDir` path MUST resolve to existing directory containing the locale files
- On locale fetch failure, the UI MUST retain current language (no raw keys shown)

---

## Entity: Client-Only Plugin

A Nuxt plugin suffixed `.client.js`/`.client.ts` that executes only in the browser, excluded from SSR bundle.

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Plugin filename |
| `path` | path | Location in `plugins/` directory |
| `suffix` | enum | `.js` (SSR+client) or `.client.js` (client-only) |
| `registered` | boolean | Listed in `nuxt.config.ts` plugins array |

### Instances

| Name | Path | Suffix | Registered | Action |
|------|------|--------|------------|--------|
| vue3-toastify | `plugins/vue3-toastify.js` | `.js` | Yes | Rename to `.client.js` |
| vue-awesome-paginate | `plugins/vue-awesome-paginate.client.js` | `.client.js` | No (auto) | None |
| vueGoogleMaps | `plugins/vueGoogleMaps.client.ts` | `.client.ts` | No (auto) | None |
| vercel-analytics | `plugins/vercel-analytics.client.ts` | `.client.ts` | No (auto) | Delete (disabled no-op) |
| clear-payload | `plugins/clear-payload.client.ts` | `.client.ts` | No (auto) | Delete (disabled no-op) |

### State Transition (vue3-toastify)

```
BEFORE:                              AFTER:
  plugins/vue3-toastify.js             plugins/vue3-toastify.client.js
  Runs on server AND client    ──→     Runs on client only
  Bundled in SSR output                Excluded from SSR output
  Registered in nuxt.config.ts         Re-registered with new name
```

---

## Entity: Swiper CSS Import

A `import 'swiper/css/...'` statement in a Vue component's `<script>` block.

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| `module` | string | CSS module path |
| `component` | path | Vue component path |
| `count` | number | Number of occurrences per module |

### Current State (summary)

| CSS Module | Occurrences |
|------------|-------------|
| `swiper/css` | 27 (all components) |
| `swiper/css/pagination` | 16 |
| `swiper/css/navigation` | 17 |
| `swiper/css/free-mode` | 2 (SwiperModal, MainSwiper) |
| `swiper/css/thumbs` | 2 (SwiperModal, MainSwiper) |
| **Total** | **64** |

### Target State

```
BEFORE:                              AFTER:
  64 per-component imports    ──→     5 global CSS entries in nuxt.config.ts css array
  CSS duplicated across                CSS loaded once for all pages
  component chunks                     
```

### Validation Rules

- After removal, zero components may contain `import 'swiper/css/...'` (except swiper/vue JS component import)
- The 5 CSS modules must be listed in `nuxt.config.ts` css array in correct order: `swiper/css` first, then sub-modules
- All Swiper carousels must render correctly (homepage, tour detail, blog, event, gallery)

---

## Entity: Module Registration (Vercel Speed Insights)

A Nuxt module entry in the `modules` array of `nuxt.config.ts`.

### Current State

```js
modules: [
  // ...
  "@vercel/speed-insights",       // DUPLICATE — base package, not a Nuxt module
  "@vercel/speed-insights/nuxt",  // CORRECT — Nuxt module entry point
]
```

### Target State

```js
modules: [
  // ...
  "@vercel/speed-insights/nuxt",  // Only valid registration
]
```

### Validation Rules

- `@vercel/speed-insights` MUST appear exactly once in modules array
- Only `@vercel/speed-insights/nuxt` form MUST remain (this is the Nuxt module path)
- Speed Insights MUST continue to collect/transmit data in production

---

## Entity: Datepicker CSS

The `@vuepic/vue-datepicker/dist/main.css` stylesheet.

### Current State

```
app.vue (global):
  import '@vuepic/vue-datepicker/dist/main.css'  ← loaded on every page
```

### Target State

```
app.vue (global):
  [import removed]
  [custom .dp__* / .v3dp__* overrides preserved in <style> block]

components/UI/Date.vue:
  import '@vuepic/vue-datepicker/dist/main.css'  ← ADDED

components/UI/Shortcuts/Date.vue:
  import '@vuepic/vue-datepicker/dist/main.css'  ← ADDED
```

### Validation Rules

- Pages without a datepicker MUST NOT include `@vuepic/vue-datepicker/dist/main.css` in their stylesheet payload
- Datepicker MUST render with correct styling (no FOUC, no layout shift) on pages using it
- Custom `.dp__*` and `.v3dp__*` overrides in app.vue must continue to apply correctly
