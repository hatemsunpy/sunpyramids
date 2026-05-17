# Contract: BlogCard

**File**: `components/Shared/BlogCard.vue`
**Type**: UI Component

## Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| blog | Object | true | — | Blog data object containing `slug`, `featured_image`, `tags`, `title` |

## CWV Contract

### CLS
- The image wrapper (`h-[12.0625rem]`) MUST have explicit dimensions.
- `NuxtImg` MUST receive explicit `width` and `height` props to prevent layout shift on load.
- If `featured_image` dimensions are unknown at build time, the parent MUST pass them or the component MUST compute `aspect-ratio` from known defaults.

### LCP
- `loading="lazy"` is appropriate for blog cards that typically appear below the fold.
- If a BlogCard is placed in the first viewport (hero section), the parent MUST override to `loading="eager"`.

### Prefetch
- `NuxtLink` wrapping the image and title MUST have `:prefetch="false"`.
- The link MUST remain a real `<a href>` element in rendered HTML.

## SEO Contract
- No hardcoded SEO values.
- Links MUST remain crawlable.
