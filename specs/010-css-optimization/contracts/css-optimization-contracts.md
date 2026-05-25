# Plugin Contract: Critical CSS Module

**Feature**: 010-css-optimization
**Type**: Internal Nuxt Module
**Path**: `modules/critical-css.ts`

## Interface

### Module Registration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    // ...existing modules
    '~/modules/critical-css',
  ],
  criticalCSS: {
    // Module options (see below)
  },
})
```

### Configuration Schema

```ts
interface CriticalCSSOptions {
  /**
   * Route paths (without locale prefix) that receive critical CSS inlining.
   * @default ['/', '/tours', '/about-us', '/contact-us', '/events', '/make-your-trip']
   */
  routes: string[]

  /**
   * Supported locale prefixes for route expansion.
   * @default ['en', 'fr', 'de', 'it', 'pt', 'es', 'zh']
   */
  locales: string[]

  /**
   * Maximum inline CSS size in bytes. Styles beyond this stay external.
   * @default 14336 (14KB)
   */
  inlineThreshold: number

  /**
   * CSS preload strategy after inline.
   * @default 'swap'
   */
  preload: 'swap' | 'default'

  /**
   * Whether to compress inlined CSS (disable if CDN handles compression).
   * @default false
   */
  compress: boolean

  /**
   * Name of the CSS cache cookie.
   * @default 'css-cached'
   */
  cookieName: string

  /**
   * Cookie max age in seconds.
   * @default 2592000 (30 days)
   */
  cookieMaxAge: number

  /**
   * Enable critical CSS inlining. Set to false to bypass entire module.
   * @default true
   */
  enabled: boolean
}
```

### Runtime Behavior

1. **On SSR render** (`render:response` hook):
   - Check if `request.headers.cookie` contains `css-cached=true` → if yes, skip processing.
   - Check if `route.path` (locale-stripped) is in the configured route whitelist → if no, skip processing.
   - Run `beasties` on the rendered HTML with the configured options.
   - Replace the response body with the processed HTML.
   - Add `Set-Cookie: css-cached=true; Path=/; Max-Age=2592000; SameSite=Lax` to response headers.

2. **Error handling**:
   - If `beasties` errors, log a warning and return the unprocessed HTML — never fail the response.
   - If processing time exceeds a reasonable threshold (e.g., 500ms per page), log a warning (degraded gracefully, not a build failure).

### Dependencies

- `beasties` (npm package, ~50KB, zero transitive dependencies)

---

## PostCSS PurgeCSS Contract

**Path**: `postcss.config.js` (production only)

### Configuration

```ts
// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // PurgeCSS: production only
    ...(process.env.NODE_ENV === 'production'
      ? [purgecss({
          content: [
            './components/**/*.vue',
            './pages/**/*.vue',
            './layouts/**/*.vue',
            './app.vue',
            './plugins/**/*.{js,ts}',
            './composables/**/*.{js,ts}',
          ],
          safelist: {
            standard: [],
            deep: [],
            greedy: [
              /^nuxt-icon/,
              /^swiper-/,
              /^vee-/,
              /^error/,
              /^is-active/,
              /^is-open/,
              /^Toastify/,
              /^scaleBG/,
            ],
          },
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        })]
      : []),
  ],
}
```

### Contract

- **Input**: All Vue/TS/JS source files (content), all generated CSS files (css).
- **Output**: Purged CSS files with only selectors found in the content files.
- **Safelist**: Dynamic classes not detectable via static analysis are preserved.
- **Failure mode**: If PurgeCSS errors during build, fail the build (missing CSS is worse than extra CSS).
