// Shared helpers for sitemap XML generation
// Used by all sitemap server routes under server/routes/

const FRONTEND_DOMAIN = "https://sunpyramidstours.com"
const SUPPORTED_LOCALES = ["en", "fr", "de", "it", "pt", "es", "zh"]

// Locales that get a path prefix. English (default) uses root path.
const PREFIXED_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== "en")

const API_TIMEOUT_MS = 30_000

/**
 * Escape XML special characters.
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Format a date string or Date as YYYY-MM-DD.
 * Falls back to today's date if input is invalid or missing.
 */
export function formatDate(date?: string | Date): string {
  if (!date) return todayStr()
  const d = new Date(date)
  if (isNaN(d.getTime())) return todayStr()
  return d.toISOString().slice(0, 10)
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Build a full page URL for a given locale and path.
 * English uses root domain (no /en prefix).
 * Other locales use /{locale}/path.
 */
export function buildUrl(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  if (locale === "en") {
    return `${FRONTEND_DOMAIN}${cleanPath}`
  }
  return `${FRONTEND_DOMAIN}/${locale}${cleanPath}`
}

/**
 * Build a single <xhtml:link> hreflang alternate element.
 */
export function buildHreflangAlternate(
  lang: string,
  href: string,
  isXDefault = false,
): string {
  const hreflang = isXDefault ? "x-default" : lang
  return `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}" />`
}

/**
 * Check whether a content item should be excluded from the sitemap.
 */
export function shouldExclude(item: any): boolean {
  if (!item) return true
  if (!item.slug && !item.id && !item.key) return true

  // Noindex robots directive
  if (item.seo?.robots === "noindex") return true

  // Not published (content items)
  if (item.status && item.status !== "published") return true

  // Explicitly disabled
  if (item.enabled === false) return true
  if (item.active === false) return true

  // Checkout page (client-side only)
  if (item.slug === "checkout" || item.key === "checkout") return true

  return false
}

export const API_BASE = "https://sunpyramidtours.com/api"

/**
 * Fetch all pages from a paginated Laravel API endpoint.
 * Uses $fetch (Nitro auto-import for server utils).
 * Returns all items as a flat array, or null on failure.
 */
export async function fetchAllPages<T = any>(
  path: string,
  pageLimit = 100,
): Promise<T[] | null> {
  try {
    const sep = path.includes("?") ? "&" : "?"
    // First request to get pagination metadata
    const firstRes = await $fetch<any>(
      `${API_BASE}${path}${sep}page_limit=${pageLimit}&page=1`,
      {
        timeout: API_TIMEOUT_MS,
        headers: { accept: "application/json" },
      },
    )
    const meta = firstRes?.data || firstRes
    const lastPage: number = meta?.last_page || 1
    const items: T[] = (meta?.data as T[]) || []

    // Fetch remaining pages in parallel
    if (lastPage > 1) {
      const promises: Promise<any>[] = []
      for (let p = 2; p <= lastPage; p++) {
        promises.push(
          $fetch<any>(
            `${API_BASE}${path}${sep}page_limit=${pageLimit}&page=${p}`,
            {
              timeout: API_TIMEOUT_MS,
              headers: { accept: "application/json" },
            },
          ),
        )
      }
      const results = await Promise.all(promises)
      for (const r of results) {
        const pageItems = r?.data?.data || r?.data || []
        if (Array.isArray(pageItems)) items.push(...pageItems)
      }
    }

    return items
  } catch {
    return null
  }
}

/**
 * Get all supported locales.
 */
export function getLocales(): string[] {
  return SUPPORTED_LOCALES
}

/**
 * Get locales that need a path prefix (all except English).
 */
export function getPrefixedLocales(): string[] {
  return PREFIXED_LOCALES
}

/**
 * Get the frontend domain constant.
 */
export function getFrontendDomain(): string {
  return FRONTEND_DOMAIN
}

/**
 * Build hreflang alternates for a single page across all locales.
 * @param slugFn - function that returns the localized slug for a given locale
 */
export function buildHreflangAlternates(
  slugFn: (locale: string) => string | null,
): string {
  const lines: string[] = []
  for (const locale of SUPPORTED_LOCALES) {
    const slug = slugFn(locale)
    if (!slug) continue
    const url = buildUrl(locale, slug)
    const isXDefault = locale === "en"
    lines.push(buildHreflangAlternate(locale, url, isXDefault))
  }
  return lines.join("\n    ")
}

/**
 * Wrap content in a valid XML urlset with standard namespaces.
 */
export function wrapUrlset(urls: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`
}
