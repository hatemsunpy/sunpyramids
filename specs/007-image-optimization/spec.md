# Feature Specification: Image Optimization

**Feature Branch**: `007-image-optimization`
**Created**: 2026-05-21
**Status**: Draft
**Input**: User description: "the first phase in this plan docs\\performance-optimization-plan.md"

## Clarifications

### Session 2026-05-21

- **Q**: After converting local PNG images to WebP, should the original PNG files be permanently removed from the repository?  
  **A**: Permanently replace PNGs with WebP and delete originals from the repo after all references are verified. Simple icons, social icons, logos, and flat graphics should prefer SVG over WebP where possible. PNGs required by third-party integrations, manifest icons, favicon fallbacks, app icons, or external platform requirements must not be deleted unless replacements are verified.
- **Q**: Should the LCP success criteria include a separate mobile target?  
  **A**: Yes. Mobile LCP is the primary pass/fail metric. Homepage mobile LCP must be ≤ 2.5 seconds on Lighthouse mobile emulation. Desktop LCP should also be under 2.5 seconds but is secondary.
- **Q**: What quality setting and fallback mechanism should be used for the WebP conversion?  
  **A**: Lossy WebP at quality 80. A `<picture>` element with PNG fallback should be used only for critical above-the-fold or brand-sensitive images. All other images may be served as WebP-only after confirming browser support. Icons, logos, and flat graphics should prefer SVG over WebP where possible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster Hero Banner Loading (Priority: P1)

As a visitor landing on the homepage, I want the hero banner to load quickly without blocking the browser from rendering other content, so that I can see the page sooner and start exploring.

**Why this priority**: The hero banner is the largest visible element on the homepage. Its load time directly impacts the Largest Contentful Paint (LCP) score, which is a critical Core Web Vital and affects SEO rankings.

**Independent Test**: Can be tested by visiting the homepage with a throttled connection and measuring the time until the hero banner image is fully visible.

**Acceptance Scenarios**:

1. **Given** the homepage hero banner has multiple slides, **When** the first slide loads, **Then** it should render with high priority and not be delayed by decoding of other images.
2. **Given** a non-first slide in the hero banner, **When** it is about to load, **Then** it should decode asynchronously so it does not block the main browser thread.

---

### User Story 2 - Consistent Tour Card Display (Priority: P2)

As a visitor browsing tours, I want the tour card images to load without causing the page layout to shift, so that I can click on items confidently without them moving unexpectedly.

**Why this priority**: Layout shifts (CLS) create a frustrating user experience and hurt the site's credibility. Images without explicit dimensions are a primary cause of CLS.

**Independent Test**: Can be tested by loading a page with tour cards and verifying the image area is reserved before the image finishes loading.

**Acceptance Scenarios**:

1. **Given** a tour card with an image, **When** the page renders, **Then** the browser should know the image's aspect ratio before the image finishes loading.
2. **Given** a tour card image is loading, **When** the main browser thread is busy, **Then** the image decoding should happen asynchronously to keep the page responsive.

---

### User Story 3 - Smaller Overall Page Size (Priority: P3)

As a visitor on a slower connection or mobile device, I want the website's static image files to be as small as possible, so that pages load faster and I use less of my data plan.

**Why this priority**: Large static image files (PNG format) significantly increase page weight. Converting them to a modern compressed format reduces download time, especially on mobile networks.

**Independent Test**: Can be tested by comparing the total image payload of a page before and after the optimization.

**Acceptance Scenarios**:

1. **Given** a page that references static local images, **When** the page loads, **Then** those images should be delivered in a modern compressed format that is significantly smaller than the original PNGs.
2. **Given** the conversion is complete, **When** all pages are inspected, **Then** no local PNG images larger than 100KB should remain in the public assets directory.

---

### Edge Cases

- What happens when a browser does not support the modern image format? Critical above-the-fold images should use a `<picture>` element with PNG fallback; non-critical images may be WebP-only after confirming browser support in the targeted user base.
- How does the system handle API images that already come from an external CDN? API images must remain using plain image tags and cannot be proxied through an image optimization service.
- What if a page references a converted image by its old filename? All internal references must be updated to point to the new file.
- What about PNGs required by third-party integrations, manifest icons, favicon fallbacks, app icons, or external platform requirements? These must not be deleted unless verified replacements exist.
- What about simple icons, social icons, logos, and flat graphics? These should prefer SVG over WebP where possible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hero banner images on the homepage MUST use asynchronous decoding for all slides except the first, which should decode normally.
- **FR-002**: Tour card images MUST include explicit width, height, and aspect ratio declarations to prevent layout shifts.
- **FR-003**: Tour card images MUST decode asynchronously to avoid blocking the main thread.
- **FR-004**: Highlight section images MUST have explicit width and height attributes and use lazy loading where appropriate.
- **FR-005**: All local static images in the public assets directory larger than 100KB MUST be converted to a modern compressed image format (WebP at quality 80 for photo-like assets; SVG for simple icons, logos, and flat graphics where feasible).
- **FR-006**: After conversion, all internal references to converted images MUST be updated to point to the new files. Original PNG files MUST be removed from the repository, except for those required by third-party integrations, manifest icons, favicon fallbacks, app icons, or external platform requirements.
- **FR-007**: API-sourced images MUST continue to use plain image tags and MUST NOT be routed through any server-side image optimization proxy.

### Key Entities

- **API Image**: An image fetched from an external backend API or CDN (e.g., tour galleries, banners, blog images). These are served via external URLs.
- **Local Image**: A static image file stored in the project's public assets directory (e.g., logos, banners, icons). These are served from the same domain.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Largest Contentful Paint (LCP) on the homepage improves from approximately 3-5 seconds to under 2.5 seconds on mobile (measured via Lighthouse mobile emulation). Desktop LCP should also be under 2.5 seconds but is secondary; mobile is the primary pass/fail metric.
- **SC-002**: Total image payload from local static assets is reduced by at least 80% (from approximately 7MB to under 1.5MB).
- **SC-003**: Cumulative Layout Shift (CLS) score improves to below 0.05 on pages with tour cards and hero banners.
- **SC-004**: No layout shift occurs when tour card images load on a throttled connection.

## Assumptions

- Backend API images are served from a CDN that does not support on-the-fly format conversion; optimization of those images must happen server-side by the backend team.
- The target browsers for this project support modern image formats (WebP) and the `decoding` attribute on images.
- Converting local images will not degrade visual quality perceptibly to end users.
- All pages that reference local images will have their references updated as part of this feature.
