import {
  escapeXml,
  formatDate,
  buildUrl,
  buildHreflangAlternates,
  fetchAllPages,
  shouldExclude,
  wrapUrlset,
} from "../utils/sitemap-helpers"

export default defineEventHandler(async (event) => {
  const [tourCats, blogCats] = await Promise.all([
    fetchAllPages<any>("/categories"),
    fetchAllPages<any>("/blog-categories"),
  ])

  if (!tourCats && !blogCats) {
    setHeader(event, "content-type", "application/xml; charset=utf-8")
    return wrapUrlset("")
  }

  const urls: string[] = []

  if (tourCats) {
    for (const cat of tourCats) {
      if (shouldExclude(cat)) continue
      const catSlug = cat.slug
      if (!catSlug) continue

      const getSlug = (locale: string): string | null => {
        if (locale === "en") return `/egypt-tours/${catSlug}`
        const translatedSlug = cat.translations?.[locale]?.slug
        if (translatedSlug) return `/egypt-tours/${translatedSlug}`
        return null
      }

      const alternatesXML = buildHreflangAlternates(getSlug)
      const loc = buildUrl("en", `/egypt-tours/${catSlug}`)
      const lastmod = formatDate(cat.updated_at || cat.created_at)

      urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    ${alternatesXML}
  </url>`)
    }
  }

  if (blogCats) {
    for (const cat of blogCats) {
      if (shouldExclude(cat)) continue
      const catSlug = cat.slug
      if (!catSlug) continue

      const getSlug = (locale: string): string | null => {
        if (locale === "en") return `/egypt-travel-guide/${catSlug}`
        const translatedSlug = cat.translations?.[locale]?.slug
        if (translatedSlug) return `/egypt-travel-guide/${translatedSlug}`
        return null
      }

      const alternatesXML = buildHreflangAlternates(getSlug)
      const loc = buildUrl("en", `/egypt-travel-guide/${catSlug}`)
      const lastmod = formatDate(cat.updated_at || cat.created_at)

      urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    ${alternatesXML}
  </url>`)
    }
  }

  setHeader(event, "content-type", "application/xml; charset=utf-8")
  return wrapUrlset(urls.join("\n"))
})
