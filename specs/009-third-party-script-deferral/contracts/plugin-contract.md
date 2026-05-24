# Plugin Contract: Third-Party Script Deferral

**Feature**: 009-third-party-script-deferral
**Contract Type**: Nuxt Client-Only Plugin API

---

## Plugin: `plugins/third-party-scripts.client.ts`

### Provided Injections

| Key | Type | Description |
|-----|------|-------------|
| `$ensureRecaptchaLoaded` | `() => Promise<void>` | Resolves when reCAPTCHA is ready; triggers load if not yet started. Rejects if script fails to load. |

### Consumer: `composables/recapcha.js`

```js
// BEFORE
export async function generateRecaptchaToken(siteKey, action = "submit") {
  return new Promise((resolve, reject) => {
    grecaptcha.enterprise.ready(async () => {
      try {
        const token = await grecaptcha.enterprise.execute(siteKey, { action })
        resolve(token)
      } catch (error) {
        console.error("reCAPTCHA error:", error)
        reject(error)
      }
    })
  })
}

// AFTER
export async function generateRecaptchaToken(siteKey, action = "submit") {
  const { $ensureRecaptchaLoaded, $toast } = useNuxtApp()
  try {
    await $ensureRecaptchaLoaded()
  } catch {
    $toast?.error("Security verification unavailable, please try again.")
    throw new Error("reCAPTCHA load failed")
  }
  return new Promise((resolve, reject) => {
    grecaptcha.enterprise.ready(async () => {
      try {
        const token = await grecaptcha.enterprise.execute(siteKey, { action })
        resolve(token)
      } catch (error) {
        console.error("reCAPTCHA error:", error)
        $toast?.error("Security verification failed. Please try again.")
        reject(error)
      }
    })
  })
}
```

### Consumer: Form Components (ContactUs, NeedHelp, MakeYourTrip/Form, Event/RightPanal/Book)

All form submit handlers that call `generateRecaptchaToken()` receive a thrown error on failure. They should surface the error via their existing toast/error display pattern. No changes needed to form handler code beyond what `recapcha.js` handles.

---

## Contract: Third-Party Script Loading

### Script Injection Order

```
1. reCAPTCHA Enterprise   (priority: 1 — needed by forms)
2. GTM + GA4              (priority: 2 — analytics, not user-facing)
[TrustIndex is loaded on idle, not interaction — separate trigger]
```

### Trigger Conditions

| Condition | Scripts Loaded |
|-----------|---------------|
| User scrolls, clicks, touches, moves mouse, or presses key | reCAPTCHA, GTM+GA4 |
| 5 seconds pass with no interaction | reCAPTCHA, GTM+GA4 |
| `requestIdleCallback` fires (or 5s fallback) | TrustIndex (if container exists) |
| `generateRecaptchaToken()` called before interaction/timeout | reCAPTCHA (on-demand) |
| `?no-third-party` query param present | None (plugin exits early) |

### No-Duplicate Guarantee

- Plugin sets `loaded = true` after first `loadAllScripts()` call
- SPA route changes do NOT reset `loaded`
- `recaptchaPromise` is cached; multiple `ensureRecaptchaLoaded()` calls return the same Promise
- TrustIndex scripts tracked in `Set<string>` of injected container IDs

---

## Contract: TrustIndex Component Changes

### BEFORE (each component)

```vue
<script setup>
const trustindexContainer = ref(null)
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.trustindex.io/loader.js?...'
  script.async = true
  script.defer = true
  if (trustindexContainer.value) {
    trustindexContainer.value.appendChild(script)
  }
})
</script>
<template>
  <div id="home-reviews" ref="trustindexContainer"></div>
</template>
```

### AFTER (each component)

```vue
<template>
  <div id="home-reviews" style="min-height: 100px"></div>
</template>
```

**Required changes per component**:
- Remove `ref`, `onMounted` import, and script injection block
- Keep the container `div` with its `id` attribute
- Add a reserved `min-height` (matching current widget height) to prevent CLS

### Affected Components

| Component | Container ID | Remove |
|-----------|-------------|--------|
| `components/MarktingPages/index.vue` | `#home-reviews` | `trustindexContainer` ref, onMounted script injection |
| `components/Events/index.vue` | `#home-reviews` | `trustindexContainer` ref, onMounted script injection |
| `components/Event/index.vue` | `#home-reviews` | `trustindexContainer` ref, onMounted script injection |
| `components/Footer/index.vue` | `#footer-cert` | `trustindexContainerFooterCert` ref, onMounted script injection |
