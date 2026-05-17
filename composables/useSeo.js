import {
  getPathWithoutLocale,
  validateAndParseSchema,
  buildCanonicalUrl,
  generateHreflangLinks,
} from "~~/utils/seo";
import langsConfig from "~~/i18n/Helpers/config";

const ALL_LOCALES = langsConfig.map((l) => l.code);

const META_NAME_TAGS = {
  meta_description: "description",
  twitter_card: "twitter:card",
  twitter_title: "twitter:title",
  twitter_description: "twitter:description",
  twitter_image: "twitter:image",
  twitter_creator: "twitter:creator",
};

const META_PROPERTY_TAGS = {
  og_title: "og:title",
  og_description: "og:description",
  og_image: "og:image",
  og_type: "og:type",
};

export default function () {
  const nuxtApp = useNuxtApp();
  const { locale } = useI18n();
  const config = useRuntimeConfig();
  const appUrl = config.public.appURL;
  const siteName = config.public.siteName || "Sun Pyramids Tours";

  function addSeo(page, options = {}) {
    const { availableLocales = ALL_LOCALES } = options;

    try {
      if (!page?.seo) {
        return {};
      }

      const route = useRoute();
      const currentPath = route.fullPath;
      const canonicalUrl =
        page.seo.canonical || buildCanonicalUrl(currentPath, locale, appUrl);
      const localeIso =
        langsConfig.find((l) => l.code === locale)?.iso || "en-US";

      const seo = {
        title:
          page.seo.meta_title ||
          page.seo.og_title ||
          page.title ||
          page.name ||
          siteName,
        meta: [
          { name: "viewport", content: page.seo.viewport || "width=device-width, initial-scale=1" },
          { name: "robots", content: page.seo.robots || "index, follow" },
          { charset: "utf-8" },
          { property: "og:url", content: canonicalUrl },
          { property: "og:site_name", content: siteName },
          { property: "og:locale", content: localeIso },
        ],
        link: [
          { rel: "canonical", href: canonicalUrl },
          ...generateHreflangLinks(availableLocales, currentPath, appUrl),
        ],
        script: [],
      };

      for (const [field, tagName] of Object.entries(META_NAME_TAGS)) {
        if (page.seo[field]) {
          seo.meta.push({ name: tagName, content: page.seo[field] });
        }
      }

      for (const [field, tagName] of Object.entries(META_PROPERTY_TAGS)) {
        if (page.seo[field]) {
          seo.meta.push({ property: tagName, content: page.seo[field] });
        }
      }

      // Twitter fallback chain: twitter:* -> og:* -> meta_*
      if (!page.seo.twitter_title) {
        const fallback = page.seo.og_title || page.seo.meta_title;
        if (fallback) seo.meta.push({ name: "twitter:title", content: fallback });
      }
      if (!page.seo.twitter_description) {
        const fallback = page.seo.og_description || page.seo.meta_description;
        if (fallback) seo.meta.push({ name: "twitter:description", content: fallback });
      }
      if (!page.seo.twitter_image && page.seo.og_image) {
        seo.meta.push({ name: "twitter:image", content: page.seo.og_image });
      }

      // OG fallback chain: og:* -> meta_*
      if (!page.seo.og_title && page.seo.meta_title) {
        seo.meta.push({ property: "og:title", content: page.seo.meta_title });
      }
      if (!page.seo.og_description && page.seo.meta_description) {
        seo.meta.push({ property: "og:description", content: page.seo.meta_description });
      }

      // Schema
      const schema = validateAndParseSchema(page);
      if (schema) {
        const schemas = Array.isArray(schema) ? schema : [schema];
        for (const sc of schemas) {
          seo.script.push({
            innerHTML: sc,
            type: "application/ld+json",
          });
        }
      }

      nuxtApp.runWithContext(() => useHead(seo));
      return seo;
    } catch (e) {
      console.warn("[useSeo] Failed to apply SEO:", e);
      nuxtApp.runWithContext(() =>
        useHead({ title: page?.seo?.meta_title || page?.title || siteName })
      );
      return {};
    }
  }

  return { addSeo };
}
