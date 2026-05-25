/**
 * Third-Party Script Deferral Plugin
 *
 * Defers all non-critical third-party scripts (reCAPTCHA, GTM+GA4, TrustIndex)
 * until first user interaction or a 5-second timeout, removing them from the
 * critical rendering path.
 *
 * ## Extensibility Pattern
 *
 * To register a new third-party script:
 * 1. Define a load function (e.g. `loadNewService()`)
 * 2. Register it in `loadAllScripts()` (for interaction-triggered scripts) or
 *    `checkTrustIndexContainers()` (for DOM-based/idle-triggered scripts)
 *
 * ## How `no-third-party` Gate Works
 *
 * When the `?no-third-party` query param is present, the plugin exits early
 * without registering any interaction listeners or loading any scripts.
 *
 * ## How `loaded` Guard Prevents Duplicates
 *
 * `loaded` is set to true before any script injection. SPA route changes do
 * NOT reset it. Each script-loading function also has its own dedup check.
 *
 * ## `$ensureRecaptchaLoaded` Pattern
 *
 * Returns a cached Promise that resolves when reCAPTCHA is ready. Can be
 * replicated for other on-demand scripts: cache the promise, check for
 * existing global, resolve immediately if ready, otherwise create and cache.
 */

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const route = useRoute()
  if (route.query['no-third-party'] !== undefined) return

  let loaded = false

  // --- reCAPTCHA on-demand loading ---

  const RECAPTCHA_SRC =
    'https://www.google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn'

  let recaptchaPromise: Promise<void> | null = null

  function ensureRecaptchaLoaded(): Promise<void> {
    if (window.grecaptcha) return Promise.resolve()
    if (!recaptchaPromise) {
      recaptchaPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = RECAPTCHA_SRC
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => {
          recaptchaPromise = null
          document.head.removeChild(script)
          reject(new Error('reCAPTCHA load failed'))
        }
        document.head.appendChild(script)
      })
    }
    return recaptchaPromise
  }

  nuxtApp.provide('ensureRecaptchaLoaded', ensureRecaptchaLoaded)

  // --- GTM + GA4 ---

  function loadGtmGa4() {
    // GA4 config
    const gaScript = document.createElement('script')
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J'
    gaScript.async = true
    document.head.appendChild(gaScript)

    // Inline GTM init
    const inlineScript = document.createElement('script')
    inlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NKZ6W32C4J');
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
        j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-KDF33T7');
    `
    document.head.appendChild(inlineScript)
  }

  // --- TrustIndex DOM-based detection ---

  const TRUSTINDEX_CONTAINERS: Record<string, string> = {
    'home-reviews': 'https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e',
    'footer-cert': 'https://cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a',
  }

  const loadedTrustIndex = new Set<string>()

  function checkTrustIndexContainers() {
    for (const [id, src] of Object.entries(TRUSTINDEX_CONTAINERS)) {
      if (loadedTrustIndex.has(id)) continue
      if (document.getElementById(id)) {
        loadedTrustIndex.add(id)
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
    }
  }

  function scheduleTrustIndexCheck() {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => checkTrustIndexContainers(), { timeout: 5000 })
    } else {
      setTimeout(checkTrustIndexContainers, 5000)
    }
  }

  // --- Router watcher for SPA navigations ---

  const router = useRouter()
  router.afterEach(() => {
    nextTick(() => checkTrustIndexContainers())
  })

  // --- loadAllScripts (triggered by interaction or timeout) ---

  function loadAllScripts() {
    if (loaded) return
    loaded = true

    // Remove interaction listeners
    const events = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown']
    events.forEach((evt) =>
      window.removeEventListener(evt, onInteraction, { capture: true })
    )

    // Load reCAPTCHA (fire-and-forget, errors logged)
    ensureRecaptchaLoaded().catch((err) => console.error(err))

    // Load GTM + GA4
    loadGtmGa4()

    // Schedule TrustIndex check on idle
    scheduleTrustIndexCheck()
  }

  // --- Interaction detection ---

  function onInteraction() {
    loadAllScripts()
  }

  const interactionEvents = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown']
  interactionEvents.forEach((evt) =>
    window.addEventListener(evt, onInteraction, {
      once: true,
      capture: true,
      passive: true,
    })
  )

  // 5-second fallback
  setTimeout(() => {
    if (!loaded) loadAllScripts()
  }, 5000)
})
