# Data Model: Image Optimization

**Feature**: Image Optimization (007-image-optimization)
**Date**: 2026-05-21

## Entities

### API Image

An image fetched from an external backend API or CDN.

| Attribute | Type | Description |
|-----------|------|-------------|
| `src` | `string` (URL) | External CDN URL (e.g., `https://pub-5ccb6ad334fb427684d7f3fa11a34197.r2.dev/...`) |
| `alt` | `string` | Descriptive alt text for accessibility |
| `width` | `number` | Intrinsic width in pixels |
| `height` | `number` | Intrinsic height in pixels |
| `loading` | `'eager' \| 'lazy'` | `'eager'` for above-the-fold, `'lazy'` for below-the-fold |
| `fetchpriority` | `'high' \| 'auto' \| 'low'` | `'high'` for first visible slide, `'auto'` otherwise |
| `decoding` | `'sync' \| 'async' \| 'auto'` | `'auto'` for first slide, `'async'` for non-first slides |

**Constraints**:
- MUST be rendered with plain `<img>` tag
- MUST NOT be routed through any server-side image optimization proxy
- MUST have explicit `width` and `height` attributes to prevent CLS

### Local Image

A static image file stored in the project's public assets directory.

| Attribute | Type | Description |
|-----------|------|-------------|
| `src` | `string` (path) | Relative path from `/public` (e.g., `/images/logo.webp`) |
| `alt` | `string` | Descriptive alt text |
| `format` | `'webp' \| 'avif' \| 'svg'` | Modern compressed format |
| `size` | `number` (bytes) | File size on disk |
| `quality` | `number` (0-100) | Compression quality (default: 80 for WebP) |

**Constraints**:
- Photo-like assets >100KB MUST be WebP at quality 80
- Simple icons, logos, flat graphics SHOULD prefer SVG
- MUST be referenced via `<NuxtImg>` to leverage ipx optimization
- Original PNG files MUST be deleted after all references updated

## Relationships

- **API Image** ↔ **Page Component**: Each page/component that displays dynamic content (tours, blogs, banners) references zero or more API Images.
- **Local Image** ↔ **Page Component**: Each page/component that displays static branding or decorative images references zero or more Local Images.

## State Transitions

```
Local Image Lifecycle:
  PNG (source) → WebP/SVG (converted) → Deleted (PNG removed after verification)
```

## Validation Rules

1. All `<img>` tags for API images MUST have `width` and `height` attributes.
2. All non-first hero banner slides MUST have `decoding="async"`.
3. All tour card images MUST have explicit `aspect-ratio` in CSS or inline style.
4. No local PNG file >100KB should remain in `public/images/` after conversion.
5. All image references in Vue components, CSS, and HTML must point to the new file format.
