# Contract: Footer

**File**: `components/Footer/index.vue`
**Type**: UI Component

## CWV Contract

### CLS
- The social icon buttons (`w-14 h-14`) already have explicit dimensions.
- The `NuxtImg` logo (`w-[16.25rem]`) MUST have explicit `width`/`height` props.

### Image Optimization
- Social icons currently use `NuxtIcon` (likely SVG). Verify these are SVG-based and not large PNG fallbacks.
- The WhatsApp/footer PNG icons (`/images/whatsapp-footer.png`, `~/assets/icons/phone-footer.svg`) MUST be optimized or replaced with inline SVGs.

### Third-Party Scripts
- TrustIndex script injection in `onMounted` MUST remain guarded by `process.client`.
- The script MUST remain `async` and `defer`.

## SEO Contract
- Footer links MUST remain real `<a href>` elements (currently `@click="router.push"` on privacy/terms links; these MUST be converted to `NuxtLink` with `:prefetch="false"`).
- No hardcoded SEO values.
