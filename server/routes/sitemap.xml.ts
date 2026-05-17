import {
  escapeXml,
  formatDate,
  buildUrl,
  buildHreflangAlternate,
  getFrontendDomain,
} from "../utils/sitemap-helpers"

const DOMAIN = getFrontendDomain()
const DATE = formatDate()

export default defineEventHandler((event) => {
  const subSitemaps = [
    { loc: "sitemap-pages.xml" },
    { loc: "sitemap-tours.xml" },
    { loc: "sitemap-blog.xml" },
    { loc: "sitemap-categories.xml" },
  ]

  const entries = subSitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${escapeXml(`${DOMAIN}/${s.loc}`)}</loc>
    <lastmod>${DATE}</lastmod>
  </sitemap>`,
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`

  setHeader(event, "content-type", "application/xml; charset=utf-8")
  return xml
})
