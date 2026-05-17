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
  const posts = await fetchAllPages<any>(
    "/blogs?includes=seo,categories,translations",
  )

  if (!posts) {
    setHeader(event, "content-type", "application/xml; charset=utf-8")
    return wrapUrlset("")
  }

  const urls: string[] = []

  for (const post of posts) {
    if (shouldExclude(post)) continue

    const postSlug = post.slug
    if (!postSlug) continue

    const getSlug = (locale: string): string | null => {
      if (locale === "en") return `/blog/${postSlug}`
      const translatedSlug = post.translations?.[locale]?.slug
      if (translatedSlug) return `/blog/${translatedSlug}`
      return null
    }

    const alternatesXML = buildHreflangAlternates(getSlug)
    const loc = buildUrl("en", `/blog/${postSlug}`)
    const lastmod = formatDate(post.updated_at || post.created_at)

    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    ${alternatesXML}
  </url>`)
  }

  setHeader(event, "content-type", "application/xml; charset=utf-8")
  return wrapUrlset(urls.join("\n"))
})
