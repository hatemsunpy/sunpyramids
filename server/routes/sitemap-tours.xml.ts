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
  const tours = await fetchAllPages<any>(
    "/tours?includes=seo,destinations,translations",
  )

  if (!tours) {
    setHeader(event, "content-type", "application/xml; charset=utf-8")
    return wrapUrlset("")
  }

  const urls: string[] = []

  for (const tour of tours) {
    if (shouldExclude(tour)) continue

    const tourSlug = tour.slug
    if (!tourSlug) continue

    const getSlug = (locale: string): string | null => {
      if (locale === "en") return `/tour/${tourSlug}`
      const translatedSlug = tour.translations?.[locale]?.slug
      if (translatedSlug) return `/tour/${translatedSlug}`
      return null
    }

    const alternatesXML = buildHreflangAlternates(getSlug)
    const loc = buildUrl("en", `/tour/${tourSlug}`)
    const lastmod = formatDate(tour.updated_at || tour.created_at)

    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    ${alternatesXML}
  </url>`)
  }

  setHeader(event, "content-type", "application/xml; charset=utf-8")
  return wrapUrlset(urls.join("\n"))
})
