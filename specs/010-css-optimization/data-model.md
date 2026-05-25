# Data Model: CSS Optimization

**Feature**: 010-css-optimization
**Date**: 2026-05-25

## Entities

### CriticalCSSConfig

Configuration object controlling which routes receive critical CSS inlining.

| Field | Type | Description |
|---|---|---|
| `routes` | `string[]` | Whitelist of page paths (without locale prefix) that receive critical CSS |
| `locales` | `string[]` | Supported locale prefixes to expand routes (en, fr, de, it, pt, es, zh) |
| `inlineThreshold` | `number` | Max bytes for inline CSS block (14336 = 14KB) |
| `preload` | `'swap'` | How the external stylesheet loads after inline CSS |
| `compress` | `boolean` | Whether to compress inlined CSS (false — Vercel handles) |

**Derived Routes**: The effective list is the Cartesian product of `routes × locales` plus routes with the default locale prefix omitted. Example: `/` expands to `/`, `/fr/`, `/de/`, etc. (7 variants). `locales[0]` (English) omits the prefix: `about-us` → `/about-us` not `/en/about-us`.

**State**: Read-only at runtime; defined at build time in the Nuxt module configuration.

---

### RouteCSSMap

Mapping between application routes and their CSS dependencies.

| Field | Type | Description |
|---|---|---|
| `route` | `string` | Route path pattern (e.g., `/tours`, `/event/:id`) |
| `cssFiles` | `string[]` | CSS files needed by this route (e.g., `['swiper/css', 'swiper/css/pagination']`) |
| `sourceComponent` | `string` | Component path that imports the CSS (for traceability) |

**Example**:
```
{ route: '/tours',         cssFiles: ['swiper/css', 'swiper/css/pagination', 'swiper/css/navigation'], sourceComponent: 'components/Tours/index.vue' }
{ route: '/event/:id',     cssFiles: ['swiper/css', 'swiper/css/pagination'], sourceComponent: 'components/Event/index.vue' }
{ route: '/contact-us',    cssFiles: [], sourceComponent: null }
```

**State**: Implicit — determined by which components import which CSS files. No runtime data structure needed (Vite handles the splitting automatically).

---

### PurgeCSSConfig

Configuration for unused CSS removal.

| Field | Type | Description |
|---|---|---|
| `content` | `string[]` | Glob patterns for files that reference CSS classes |
| `safelist` | `string[]` | CSS selectors to always preserve (dynamic/third-party classes) |
| `css` | `string[]` | Glob patterns for CSS files to scan |
| `enabled` | `boolean` | Enable purging (production only) |

**Safelist entries** (initial):
```
/^nuxt-icon/,      // Nuxt Icons module
/^swiper-/,        // Swiper library
/^vee-/,           // VeeValidate
/^error/,          // Validation error classes
/^is-active/,      // Interaction state classes
/^is-open/,        // Dropdown/modal state classes
::-webkit-scrollbar, // Browser pseudo-elements
/^Toastify/,       // vue3-toastify
/^scaleBG/,        // Custom utility in main.scss
```

**Derived**: Vite/Rollup CSS output files found at `dist/_nuxt/*.css`.

---

### CSS Cache State

Simple boolean state tracked via HTTP cookie.

| Field | Type | Description |
|---|---|---|
| `css-cached` | `boolean` | Whether the browser has the full CSS stylesheet cached |

**Lifecycle**:
1. First visit: cookie absent → critical CSS inlined → `Set-Cookie: css-cached=true`
2. Return visit: cookie present → skip critical CSS inlining → standard `<link>` tag
3. Expiry: 30 days → cookie expires → treated as first visit again

**Storage**: Browser cookie (`Path=/`, `Max-Age=2592000`, `SameSite=Lax`).

---

## Relationships

```
CriticalCSSConfig
  └─ controls → RouteCSSMap (determines which routes receive inline CSS)

RouteCSSMap
  └─ derived from → Component imports (Vite tree-shaking)

PurgeCSSConfig
  └─ operates on → CSS output files (post-build)
  └─ safelist references → RouteCSSMap entries for third-party imports

CSS Cache State
  └─ gates → CriticalCSSConfig (skips processing when cookie present)
```

No new persistent database storage. All entities are either build-time configuration or ephemeral HTTP state.
