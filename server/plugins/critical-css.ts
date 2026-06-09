import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Critical CSS inlining — runs inside Nitro at request time.
// We use a server plugin because nuxt.hook('render:response') only
// exists at build-time and is NOT serialized into the production bundle.

const MODULE_OPTIONS = {
  inlineThreshold: 14336,
  preload: 'swap' as const,
  compress: false,
  cookieName: 'css-cached',
  cookieMaxAge: 2592000,
  routes: ['/', '/tours', '/about-us', '/contact-us', '/events', '/make-your-trip'],
  locales: ['en', 'fr', 'de', 'it', 'pt', 'es', 'zh'],
}

// Expand route whitelist with locale prefixes
const expandedRoutes = new Set<string>()
for (const route of MODULE_OPTIONS.routes) {
  expandedRoutes.add(route)
  for (const locale of MODULE_OPTIONS.locales) {
    if (locale !== 'en') {
      expandedRoutes.add(`/${locale}${route}`)
    }
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    try {
      const body = response.body
      if (typeof body !== 'string' || !body.includes('</html>')) {
        return
      }

      const contentType = response.headers?.['content-type'] || ''
      if (!contentType.includes('text/html')) {
        return
      }

      // Cookie short-circuit: if user already has css-cached, skip processing
      const cookieHeader = event.node?.req?.headers?.cookie || ''
      const cookieEntries = cookieHeader.split(';').map((c) => c.trim())
      const hasCachedCookie = cookieEntries.some(
        (c) => c === `${MODULE_OPTIONS.cookieName}=true`
      )
      if (hasCachedCookie) {
        return
      }

      // Route whitelist check
      const pathname = event.path || ''
      const localePattern = new RegExp(
        `^/(${MODULE_OPTIONS.locales.join('|')})(?=/|$)`
      )
      const stripped = pathname.replace(localePattern, '').replace(/\/$/, '') || '/'
      if (!expandedRoutes.has(pathname) && !expandedRoutes.has(stripped)) {
        return
      }

      // Locate the public directory so beasties can find CSS files on disk.
      // On Vercel the files may not be on disk, so we also provide an HTTP fallback.
      const possiblePublicPaths = [
        resolve(process.cwd(), '.output', 'public'),
        resolve(process.cwd(), 'public'),
      ]
      let publicPath = possiblePublicPaths[0]
      for (const p of possiblePublicPaths) {
        try {
          await readFile(resolve(p, 'favicon.ico'))
          publicPath = p
          break
        } catch {
          // continue
        }
      }

      const Beasties = await import('beasties').then(
        (m: any) => m.default || m
      )
      const beasties = new Beasties({
        inlineThreshold: MODULE_OPTIONS.inlineThreshold,
        preload: MODULE_OPTIONS.preload,
        compress: MODULE_OPTIONS.compress,
        path: publicPath,
      })

      // Vercel / serverless fallback: fetch CSS from same origin if not on disk
      const protocol = event.node?.req?.headers?.['x-forwarded-proto'] || 'https'
      const host = event.node?.req?.headers?.host || ''
      const baseUrl = `${protocol}://${host}`

      beasties.fs = {
        readFile: (filename: string, callback: (err: any, data?: string) => void) => {
          readFile(filename, 'utf-8')
            .then((data) => callback(null, data))
            .catch(() => {
              const relativePath = filename
                .replace(publicPath, '')
                .replace(/\\/g, '/')
              const url = `${baseUrl}${relativePath}`
              fetch(url)
                .then((res) => {
                  if (!res.ok) throw new Error(`HTTP ${res.status}`)
                  return res.text()
                })
                .then((text) => callback(null, text))
                .catch((err) => callback(err))
            })
        },
      }

      const processedHTML = await beasties.process(body)
      response.body = processedHTML

      // Set cache cookie so returning visitors skip the overhead
      const existingSetCookie =
        event.node?.res?.getHeader?.('Set-Cookie') ||
        // @ts-ignore
        event.node?.res?.getHeaders?.()?.['set-cookie'] ||
        []
      const cookiesArr = Array.isArray(existingSetCookie)
        ? existingSetCookie
        : [existingSetCookie].filter(Boolean)
      cookiesArr.push(
        `${MODULE_OPTIONS.cookieName}=true; Path=/; Max-Age=${MODULE_OPTIONS.cookieMaxAge}; SameSite=Lax`
      )
      event.node?.res?.setHeader?.('Set-Cookie', cookiesArr)
    } catch (err) {
      console.warn('[critical-css] Failed to inline critical CSS:', (err as Error).message)
    }
  })
})
