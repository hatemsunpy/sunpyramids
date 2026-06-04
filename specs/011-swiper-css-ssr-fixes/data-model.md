# Data Model

N/A — No new entities, state transitions, or data structures introduced by this feature.

Changes are limited to:
- **CSS import location** (build-time only) — moving Swiper CSS from per-component imports to global `nuxt.config.ts` `css` array
- **Script injection timing** (runtime behavior) — removing immediate TrustIndex injection from `pages/index.vue`
- **API call timing** (SSR vs. client-side) — changing `await getnationalities()` in `components/Header/index.vue` to client-side fire-and-forget

All existing entities (`sharedStore`, `third-party-scripts` plugin, Swiper components) remain unchanged in shape and behavior.
