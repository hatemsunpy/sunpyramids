import { defineNuxtModule } from '@nuxt/kit'
import type { NuxtRenderHTMLContext } from 'nuxt/app'

interface CriticalCSSOptions {
  routes: string[]
  locales: string[]
  inlineThreshold: number
  preload: 'swap' | 'default'
  compress: boolean
  cookieName: string
  cookieMaxAge: number
  enabled: boolean
}

export default defineNuxtModule<CriticalCSSOptions>({
  meta: {
    name: 'critical-css',
    configKey: 'criticalCSS',
  },
  defaults: {
    routes: ['/', '/tours', '/about-us', '/contact-us', '/events', '/make-your-trip'],
    locales: ['en', 'fr', 'de', 'it', 'pt', 'es', 'zh'],
    inlineThreshold: 14336,
    preload: 'swap',
    compress: false,
    cookieName: 'css-cached',
    cookieMaxAge: 2592000,
    enabled: true,
  },
  setup(options, nuxt) {
    if (!options.enabled) return

    // Expand routes with locale prefixes
    const expandedRoutes = new Set<string>()
    for (const route of options.routes) {
      expandedRoutes.add(route)
      for (const locale of options.locales) {
        if (locale !== 'en') {
          expandedRoutes.add(`/${locale}${route}`)
        }
      }
    }

    nuxt.hook('render:response', async (context: NuxtRenderHTMLContext) => {
      // Check for css-cached cookie
      try {
        const event = (context as any).event
        if (!event?.node) return

        const cookies = event.node.req.headers?.cookie || ''
        if (cookies.includes(`${options.cookieName}=true`)) {
          return // Skip: CSS already cached
        }

        // Strip locale prefix and check against whitelist
        const pathname = event.path || ''
        // Remove locale prefix for matching (e.g., /fr/tours -> /tours)
        const stripped = pathname.replace(/^\/([a-z]{2})(\/|$)/, '/$2').replace(/\/$/, '') || '/'

        if (!expandedRoutes.has(pathname) && !expandedRoutes.has(stripped)) {
          return // Route not in whitelist
        }

        // Process with beasties
        const Beasties = await import('beasties').then((m: any) => m.default || m)
        const beasties = new Beasties({
          inlineThreshold: options.inlineThreshold,
          preload: options.preload,
          compress: options.compress,
          path: event.node.req.url || '/',
        })

        const processedHTML = await beasties.process(context.html)
        context.html = processedHTML

        // Set cache cookie
        const existingSetCookie =
          event.node.res.getHeader?.('Set-Cookie') || event.node.res.getHeaders?.()?.['set-cookie'] || []
        const cookies_arr = Array.isArray(existingSetCookie) ? existingSetCookie : [existingSetCookie].filter(Boolean)
        cookies_arr.push(
          `${options.cookieName}=true; Path=/; Max-Age=${options.cookieMaxAge}; SameSite=Lax`
        )
        event.node.res.setHeader('Set-Cookie', cookies_arr)
      } catch (err) {
        console.warn('[critical-css] Failed to inline critical CSS:', (err as Error).message)
        // Return unprocessed HTML — never fail the response
      }
    })
  },
})
