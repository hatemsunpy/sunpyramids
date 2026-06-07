# Research: PageSpeed Audit Remediation

## Decision: JavaScript Code Splitting Strategy
- **Chosen**: Combine `defineAsyncComponent` for BTF sections + `vite build.rollupOptions.output.manualChunks` for vendor deduplication + page-level dynamic imports for heavy page-specific libraries.
- **Rationale**: 62 scripts indicates Vite's default chunking is creating many tiny chunks. Manual vendor chunks (grouping large node_modules into single files) and async components for BTF sections will reduce the initial request count dramatically.
- **Alternatives considered**: `nuxt-purgecss` (only removes unused CSS, not JS), webpack splitChunks (project uses Vite), single monolithic bundle (worse caching).

## Decision: Image Optimization Pipeline
- **Chosen**: Build-time WebP conversion for local `public/` images via a CLI tool (e.g., `sharp`, `cwebp`, or `nuxt-image` static generation). `NuxtImg` for API images with `format="webp"` and `sizes` prop.
- **Rationale**: The backend CDN does not support on-the-fly format conversion. Local images must be converted at build time. API images can use `NuxtImg`'s runtime URL construction if the backend supports query params; otherwise, use `srcset` with multiple backend URLs.
- **Alternatives considered**: Proxy through Vercel Image Optimization (requires `@vercel/image` and may hit limits), manual Photoshop conversion (not scalable), runtime canvas conversion (too slow).

## Decision: Font Preloading Mechanism
- **Chosen**: Use `useHead` in `app.vue` to inject `<link rel="preload">` tags for Trip Sans woff2 files. Update `tailwind.config.js` and `@font-face` declarations to include `font-display: swap`.
- **Rationale**: Nuxt's `useHead` is the standard way to inject head tags. `font-display: swap` is the simplest, most compatible strategy for eliminating FOIT.
- **Alternatives considered**: `font-display: optional` (may never load brand font on slow connections — unacceptable for brand identity), FOIT with preload only (still delays text rendering).

## Decision: Third-Party Script Inventory & Deferral
- **Chosen**: Run a full Network tab audit to list every external domain request. Classify each as Critical/Deferrable/Page-Scoped. Extend `third-party-scripts.client.ts` to cover deferrable ones. Remove unused scripts entirely.
- **Rationale**: There is no substitute for inspecting the actual runtime network requests. The existing plugin architecture from Phase 009 already supports `requestIdleCallback` + interaction triggering.
- **Alternatives considered**: New generic script deferral library (unnecessary — existing plugin works), blanket `defer`/`async` on all scripts (may break critical ones).

## Decision: No New Contracts
- **Chosen**: Skip `/contracts/` generation.
- **Rationale**: This is an internal performance refactoring with no external API, CLI, or library surface changes.
