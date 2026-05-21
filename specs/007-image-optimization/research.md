# Research: Image Optimization

**Feature**: Image Optimization (007-image-optimization)
**Date**: 2026-05-21

## Resolved Clarifications

All critical ambiguities were resolved during `/speckit-clarify`:

1. **PNG disposal after conversion**: Original PNG files will be permanently deleted after all references are verified. Simple icons/logos should prefer SVG. Third-party-required PNGs (favicon, manifest, app icons) must be preserved.
2. **Mobile LCP target**: Mobile LCP is the primary pass/fail metric (≤2.5s via Lighthouse mobile emulation). Desktop is secondary.
3. **WebP quality and fallback**: Lossy WebP at quality 80. `<picture>` with PNG fallback only for critical above-the-fold images. All other images are WebP-only.

## Technology Decisions

### Image Conversion Tool

**Decision**: Use `cwebp` (libwebp) or equivalent tooling (e.g., `sharp` npm package, or manual conversion with `cwebp -q 80`).

**Rationale**:
- `cwebp` is the reference implementation and widely available
- `sharp` is a Node.js alternative that can be scripted into a build step
- For a one-time conversion of ~20 files, manual `cwebp` or an npm script using `sharp` is sufficient

**Alternatives considered**:
- NuxtImg/ipx auto-conversion: Already configured in `nuxt.config.ts` (`provider: 'ipx', quality: 80, format: ['webp', 'avif']`), but this only works for images referenced via `<NuxtImg>`. The local PNGs in `/public/images/` are currently referenced directly in components, so they won't be auto-converted by ipx.
- Online converters: Rejected — not reproducible and poor for version control.

### API Image Strategy

**Decision**: Plain `<img>` tags with explicit `width`, `height`, `loading`, `fetchpriority`, and `decoding` attributes.

**Rationale**: The backend CDN (`pub-5ccb6ad334fb427684d7f3fa11a34197.r2.dev`) does not support on-the-fly format conversion. Proxying through Vercel's ipx provider breaks API images. The 33-file commit that fixed this must not be regressed.

### Local Image Strategy

**Decision**: Convert source PNGs to WebP and update all direct references. Use `<NuxtImg>` for local images to leverage ipx auto-optimization.

**Rationale**: Local images are served from the same domain, so ipx can process them. Converting the source files directly reduces repo size and ensures the optimized version is always served.

## Component Audit

Based on the performance plan and codebase analysis:

| Component | Image Type | Action Required |
|-----------|-----------|-----------------|
| `Home/MainBanner/index.vue` | API (`item.gallery`) | Add `:decoding="index === 0 ? 'auto' : 'async'"` |
| `Shared/TourCard.vue` | API (`item.gallery[0]`) | Add `decoding="async"` and `style="aspect-ratio: 400/194;"` |
| `Home/Highlights.vue` | API (`item?.featured_image`) | Verify `width`, `height`, `loading="lazy"` |
| `Shared/BlogCard.vue` | API | Already uses `<img>` — verify attributes |
| `Shared/EgyptToursCard.vue` | API | Already uses `<img>` — verify attributes |
| `Shared/EventCard.vue` | API | Already uses `<img>` — verify attributes |
| `ContactUs/MainBanner.vue` | API | Already uses `<img>` — verify attributes |
| `AboutUs/OurTeam.vue` | API | Already uses `<img>` — verify attributes |
| `Blogs/*` | API | Already uses `<img>` — verify attributes |

## PNG Files Requiring Conversion (>100KB)

| File | Size | Target Format |
|------|------|---------------|
| `public/images/wheelChair.png` | 2.4MB | WebP |
| `public/images/mainBanner.png` | 2.0MB | WebP |
| `public/images/authHero.png` | 891KB | WebP |
| `public/images/map.png` | 819KB | WebP |
| `public/images/Cairo_Egypt_Unsplash.png` | 718KB | WebP |
| `public/images/heroMuseum.png` | 692KB | WebP |
| `public/images/faqs-banner.png` | 630KB | WebP |
| `public/images/certified-logo.png` | 560KB | WebP / SVG |
| `public/images/blogsHero.png` | 526KB | WebP |
| `public/images/giza.png` | 340KB | WebP |
| `public/images/certified.png` | 295KB | WebP / SVG |
| `public/images/aboutusmainbanner.png` | 284KB | WebP |
| `public/images/realLocation.png` | 248KB | WebP |
| `public/images/certified_footer_white.png` | 183KB | WebP / SVG |
| `public/images/museums.png` | 182KB | WebP |
| `public/images/shorts.png` | 164KB | WebP |
| `public/images/certification.png` | 133KB | WebP / SVG |
| `public/images/tiktok.png` | 132KB | WebP / SVG |
| `public/images/cri-container.png` | 118KB | WebP |

## Open Questions (None Remaining)

All critical questions have been resolved. The plan is ready for Phase 1 design.
