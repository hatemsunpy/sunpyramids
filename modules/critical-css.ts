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

interface NuxtRenderContext extends NuxtRenderHTMLContext {
  event: {
    path: string
    node: {
      req: {
        headers: {
          cookie?: string
        }
        url?: string
      }
      res: {
        getHeader?: (name: string) => string | string[] | undefined
        getHeaders?: () => Record<string, string | string[]>
        setHeader: (name: string, value: string | string[]) => void
      }
    }
  }
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

    nuxt.hook('render:response', async (context: NuxtRenderContext) => {
      // Check for css-cached cookie
      try {
        const event = context.event
        if (!event?.node) return

        const cookies = event.node.req.headers?.cookie || ''
        const cookieEntries = cookies.split(';').map((c) => c.trim())
        const hasCachedCookie = cookieEntries.some(
          (c) => c === `${options.cookieName}=true`
        )
        if (hasCachedCookie) {
          return // Skip: CSS already cached
        }

        // Strip locale prefix and check against whitelist
        const pathname = event.path || ''
        // Remove locale prefix for matching (e.g., /fr/tours -> /tours)
        const stripped = pathname.replace(/^\/([a-z]{2})(?=\/|$)/, '').replace(/\/$/, '') || '/'

        if (!expandedRoutes.has(pathname) && !expandedRoutes.has(stripped)) {
          return // Route not in whitelist
        }

        // Process with beasties
        const Beasties = await import('beasties').then(
          (m: { default?: unknown } | unknown) =>
            (m as { default?: unknown }).default || m
        )
        const beasties = new Beasties({
          inlineThreshold: options.inlineThreshold,
          preload: options.preload,
          compress: options.compress,
          path: pathname || '/',
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
