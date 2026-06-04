# Research: Swiper CSS Deduplication & SSR Blocking Removal

## Decision: Global CSS vs. Per-Component Swiper Imports
- **Chosen**: Move Swiper CSS to `nuxt.config.ts` `css` array
- **Rationale**: Nuxt/Vite deduplicates CSS imports, but having imports in ~25 components creates redundant module evaluation and makes updates harder. Global CSS is the standard pattern for framework CSS.
- **Alternatives considered**: Keep as-is (maintainability debt), dynamic import (unnecessary complexity for always-needed CSS)

## Decision: TrustIndex Deferral Strategy
- **Chosen**: Remove immediate `onMounted` injection from `pages/index.vue`; rely on existing `third-party-scripts.client.ts`
- **Rationale**: The plugin already implements `requestIdleCallback` + interaction listeners + 5s timeout + router watching + `#home-reviews` DOM detection. The immediate injection bypasses all of this.
- **Alternatives considered**: Modify plugin (unnecessary — plugin already correct), add new deferral logic (duplicate)

## Decision: Header SSR Unblock Pattern
- **Chosen**: Fire `getnationalities()` client-side without `await` during SSR
- **Rationale**: Nationality data is only needed for form dropdowns. Forms load after hydration. `await` during `<script setup>` blocks the entire SSR response.
- **Alternatives considered**: `useLazyAsyncData` (overkill — this is Pinia store data, not page data), server prefetch (defeats purpose — data is optional)
- **Pattern**: Wrap in `if (process.client)` or move to `onMounted`

## Decision: No New Contracts
- **Chosen**: Skip `/contracts/` generation
- **Rationale**: This is an internal refactoring with no external API, CLI, or library surface changes.
