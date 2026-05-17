export default defineNuxtPlugin(() => {
  if (process.client) {
    const script = document.createElement('script')
    script.src = '/_vercel/insights/script.js'
    script.defer = true
    script.setAttribute('data-sdkn', '@vercel/analytics')
    script.setAttribute('data-sdkv', '1.0.0')
    document.head.appendChild(script)
  }
})
