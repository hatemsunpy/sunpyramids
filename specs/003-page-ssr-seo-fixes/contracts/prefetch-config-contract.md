# Prefetch Configuration Contract

**Feature**: 003-page-ssr-seo-fixes | **Date**: 2026-05-04

## Contract

The following configuration must be added to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  // ... existing config ...

  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false
      }
    }
  }
})
```

## Invariants

1. **Global prefetch default is `false`**: All `<NuxtLink>` components default to no prefetch. Individual components must explicitly opt-in.
2. **Rendered DOM unchanged**: `<NuxtLink>` still renders as `<a href="">` regardless of prefetch setting. Crawlability is preserved.
3. **Header navigation MAY opt in**: If header navigation feels slow after global disable, add explicit `:prefetch="true"` on header `<NuxtLink>` components only.

## Components That MUST NOT Have Prefetch Re-Enabled

| Component Type | Location | Rationale |
|---------------|----------|-----------|
| Tour cards | Various listing pages | Dozens per page, rarely clicked immediately |
| Blog cards | Blog listing, homepage | Dozens per page |
| Destination cards | Homepage, category pages | Heavy pages |
| Category cards | Navigation sections | Multiple per page |
| Footer links | Site-wide footer | Present on every page |
| Related tours | Tour detail sidebar | Below fold, conditional interest |
| Any card/listing component | Anywhere | High count, low immediate click probability |

## Components That MAY Have Prefetch Re-Enabled

| Component | Rationale |
|-----------|-----------|
| Header primary navigation links | Critical UX — users expect instant nav between main sections. Only 5-7 links. |

## Verification

After applying the config change:

1. Start dev server
2. Open browser DevTools → Network tab
3. Filter by `text/html`
4. Load homepage
5. Assert: Only one document fetched (the homepage itself)
6. Disable JavaScript in browser
7. Assert: All links work, navigation functions
8. View page source (`Ctrl+U`)
9. Assert: All card links are `<a href="...">` elements
