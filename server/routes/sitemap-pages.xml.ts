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
  const pages = await fetchAllPages<any>("/pages?includes=seo")

  if (!pages) {
    setHeader(event, "content-type", "application/xml; charset=utf-8")
    return wrapUrlset("")
  }

  const urls: string[] = []

  for (const page of pages) {
    // Pages use `key` as the slug identifier
    if (!page.key) continue
    if (shouldExclude({ ...page, slug: page.key })) continue

    const pageSlug = page.key

    const getSlug = (locale: string): string | null => {
      if (page.translations?.[locale]?.slug) return page.translations[locale].slug
      return `/${pageSlug}`
    }

    const alternatesXML = buildHreflangAlternates(getSlug)
    const loc = buildUrl("en", `/${pageSlug}`)
    const lastmod = formatDate(page.updated_at || page.created_at)

    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    ${alternatesXML}
  </url>`)
  }

  setHeader(event, "content-type", "application/xml; charset=utf-8")
  return wrapUrlset(urls.join("\n"))
})
