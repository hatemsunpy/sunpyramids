export default defineNuxtPlugin(() => {
  // Disabled: Clearing window.__NUXT__ causes hydration/runtime crashes in Nuxt 3
  // because Nuxt relies on __NUXT__ for runtime configurations, route rules, and state.
})
