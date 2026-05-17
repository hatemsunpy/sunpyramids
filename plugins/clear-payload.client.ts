export default defineNuxtPlugin(() => {
  if (process.client) {
    // After hydration completes, clear the serialized __NUXT__ payload
    // to free browser memory. Pinia stores retain the data independently.
    watchEffect(() => {
      if (typeof window !== 'undefined' && window.__NUXT__) {
        // Keep a brief reference for any immediate post-hydration consumers
        setTimeout(() => {
          if (window.__NUXT__) {
            window.__NUXT__ = undefined
          }
        }, 100)
      }
    })
  }
})
