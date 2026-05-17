# Contract: TourCard

**File**: `components/Shared/TourCard.vue`
**Type**: UI Component

## Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | Object | true | — | Tour data object containing `gallery`, `slug`, `title`, `destinations`, `categories`, `offer`, `start_from`, `offer_end_date`, `duration`, `wishlisted_exists` |
| showTimer | Boolean | false | false | Whether to display the offer countdown timer |

## CWV Contract

### CLS
- The component MUST reserve stable space before images load.
- The Swiper container MUST have explicit dimensions (`h-[12.125rem]` is already present, but image wrapper must enforce aspect ratio).
- The card container MUST NOT shift when `showTimer` becomes visible.

### LCP
- `loading="lazy"` is currently applied to all gallery images. For the first/hero image in a prominent placement, the parent component MUST pass `:loading="index > 0 ? 'lazy' : 'eager'"` or similar logic.
- `fetchpriority="high"` MUST be applied to the first visible image only.

### Prefetch
- `NuxtLink` wrapping the image and title MUST have `:prefetch="false"`.
- The link MUST remain a real `<a href>` element in rendered HTML.

### TBT
- The `setInterval` offer countdown timer MUST be guarded by `process.client` and SHOULD be replaced with `requestAnimationFrame` or a less frequent update interval (e.g., 1 second is acceptable; verify no impact).
- Swiper lazy-loading SHOULD be enabled if not already.

## SEO Contract
- No hardcoded SEO values in this component.
- Links MUST remain crawlable (`<a href>`).
- No `nofollow` or `noreferrer` added.
