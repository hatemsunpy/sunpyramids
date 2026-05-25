# Data Model: Third-Party Script Deferral

**Feature**: 009-third-party-script-deferral
**Date**: 2026-05-24

This feature has no database entities. The "data model" below documents the configuration artifacts and their relationships.

---

## Entity: Third-Party Script Registration

A third-party service whose `<script>` tag injection is managed by the deferred plugin.

### Attributes

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique script identifier | `"recaptcha"`, `"gtm-ga4"` |
| `source` | string | Current loading location | `"nuxt.config.ts"`, `"app.vue"`, `"component onMounted"` |
| `load_trigger` | enum | When to load | `"interaction"`, `"idle"`, `"on-demand"` |
| `priority` | number | Load order (lower = first) | `1` (reCAPTCHA), `2` (GTM/GA4) |
| `loaded` | boolean | Tracked by plugin to prevent duplicates | `false` → `true` |

### Instances

| ID | Script URL / Key | Current Source | Load Trigger | Priority |
|----|-------------------|----------------|--------------|----------|
| recaptcha | `google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn` | `nuxt.config.ts` app.head.script | interaction + on-demand | 1 |
| gtm-ga4 | `googletagmanager.com/gtag/js?id=G-NKZ6W32C4J` + `googletagmanager.com/gtm.js?id=GTM-KDF33T7` | `app.vue` useHead() | interaction | 2 |
| trustindex-reviews | `cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e` | 4 component onMounted blocks | idle (DOM-based) | 3 |
| trustindex-cert | `cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a` | `components/Footer/index.vue` onMounted | idle (DOM-based) | 3 |

### State Transition (all scripts)

```
BEFORE (current):                      AFTER (deferred):

  reCAPTCHA: loaded eagerly in          reCAPTCHA: loaded on first user
  SSR <head>, every page                interaction or 5s timeout, or
                                        on-demand via composable

  GTM/GA4: in SSR HTML via              GTM/GA4: loaded by plugin on
  useHead(), fires on window.load       interaction or 5s timeout

  TrustIndex: injected on mount         TrustIndex: loaded on idle
  in each component                     only when container exists
```

---

## Entity: TrustIndex Container

A DOM element with a known `id` attribute that serves as the mount point for a TrustIndex widget.

### Attributes

| Field | Type | Description |
|-------|------|-------------|
| `container_id` | string | DOM element `id` attribute |
| `script_url` | string | TrustIndex loader URL with API key |
| `components` | string[] | Vue components that render this container |
| `loaded` | boolean | Tracked by plugin per container |

### Instances

| Container ID | Script URL | Components |
|---|---|---|
| `#home-reviews` | `cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e` | `MarktingPages/index.vue`, `Events/index.vue`, `Event/index.vue` |
| `#footer-cert` | `cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a` | `Footer/index.vue` |

### Detection Flow

```
Page idle (requestIdleCallback / 5s timeout fallback)
  │
  ├── document.getElementById('home-reviews') exists?
  │   ├── Yes → inject loader.js, mark loaded
  │   └── No  → skip
  │
  ├── document.getElementById('footer-cert') exists?
  │   ├── Yes → inject loader-cert.js, mark loaded
  │   └── No  → skip
  │
  └── Route change (SPA navigation)
        └── nextTick → re-run detection
```

### Validation Rules

- TrustIndex script MUST NOT be injected unless its container exists in the DOM after hydration
- Each TrustIndex script MUST be injected exactly once per page session
- Container must have a reserved minimum height to prevent CLS when widget loads late
- Detection re-runs on each SPA route change via router watcher
