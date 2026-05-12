# Page Template Contract: SSR-Safe SEO Pattern

**Feature**: 003-page-ssr-seo-fixes | **Date**: 2026-05-04

## Contract

Every page template in `pages/` that serves SEO metadata MUST follow this pattern:

```
1. Import dependencies at top of <script setup>
2. Fetch SEO data with top-level await
3. Call addSeo() directly after the await resolves
4. Wrap in try/catch for error resilience
```

## Reference Implementation

```js
// Step 1: Import
const { getData } = useApi()
const { addSeo } = useSeo()

// Step 2: Declare reactive ref
const pageData = ref(null)

// Step 3: Fetch with top-level await + addSeo directly
try {
  pageData.value = await getData('pages/<page-slug>?includes=seo').then((res) => {
    return res.data
  })
  addSeo(pageData.value)
} catch (err) {
  // Step 4: Safe fallback
  console.warn('[SEO] Failed to fetch SEO data for <page-name>:', err.message)
  addSeo({ meta_title: 'Sun Pyramids Tours' })
}
```

## Invariants

1. **Top-level await is mandatory**: The `await` keyword must be at the `<script setup>` top level, not inside a function. This is what makes Nuxt's SSR renderer wait.
2. **Direct addSeo() call**: Call `addSeo()` on the very next line after the await resolves. No watchers, no .then() chains, no async function wrappers.
3. **Error boundary required**: Every page-level `getData()` call must be wrapped in try/catch. The catch block must call `addSeo()` with a safe fallback.
4. **API endpoint format**: Always append `?includes=seo` to the API path to request SEO metadata from the Laravel backend.

## Anti-Patterns (DO NOT USE)

### Anti-Pattern 1: Async Wrapper Without Await
```js
// DO NOT DO THIS
const fetchPage = async () => {
  await getData('pages/some-page?includes=seo').then((res) => {
    addSeo(data)
  })
}
fetchPage()  // ← not awaited, SSR doesn't wait
```

### Anti-Pattern 2: Watcher-Based addSeo
```js
// AVOID THIS (works but fragile)
await getData(...)
watch(dataRef, (val) => {
  addSeo(val)
}, { immediate: true })
```

### Anti-Pattern 3: Commented-Out SEO
```js
// DO NOT DO THIS
// const { addSeo } = useSeo()
// homeData.value = await getData(...)
// addSeo(homeData.value)
```

## Locale Resolution

See `contracts/seo-utility-contract.md` in the Phase 2 spec for the locale resolution table. The `X-Localize` header is set automatically by `useApi.js` per Phase 2 fixes. Page templates do not need to pass locale explicitly.
