import { getPathWithoutLocale, pageStructureSchema } from "~~/utils/seo";

export default function () {
  const nuxtApp = useNuxtApp();

  const appUrl = useRuntimeConfig().public.appURL;

  let pathWithoutLocale = getPathWithoutLocale();
  pathWithoutLocale = pathWithoutLocale.trim() === "/" ? "" : pathWithoutLocale;

  function addSeo(page) {
    try {
      if (!page?.seo) {
        return {};
      }
      //configure seo foreach page
      page.seo = page.seo || {};

      page.seo.canonical = page.seo.canonical || appUrl + useRoute().fullPath;

      let seo = {
        title:
          page?.seo?.meta_title ||
          page.title ||
          page.name ||
          "Sun Pyramids Tours",
        meta: [
          {
            name: "viewport",
            content: page.seo.viewport || "width=device-width, initial-scale=1",
          },
          { name: "robots", content: page.seo.robots || "index, follow" },
          { name: "charset", content: "utf-8" },
          { name: "og:url", content: page.seo.canonical },
          { name: "og:site_name", content: "Sun Pyramids Tours" },
        ],
        link: [
          { rel: "canonical", href: page.seo.canonical },
          {
            rel: "alternate",
            hreflang: "x-default",
            href: appUrl + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "en",
            href: appUrl + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "fr",
            href: appUrl + "/fr" + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "de",
            href: appUrl + "/de" + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "it",
            href: appUrl + "/it" + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "pt",
            href: appUrl + "/pt" + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: appUrl + "/es" + pathWithoutLocale,
          },
          {
            rel: "alternate",
            hreflang: "zh",
            href: appUrl + "/zh" + pathWithoutLocale,
          },
        ],
        script: [],
      };

      if (pageStructureSchema(page)) {
        let page_structure_schema = pageStructureSchema(page);
        if (Array.isArray(page_structure_schema)) {
          page_structure_schema.forEach((sc) =>
            seo.script.push({
              innerHTML: sc,
              type: "application/ld+json",
            })
          );
        } else {
          seo.script.push({
            innerHTML: page_structure_schema,
            type: "application/ld+json",
          });
        }
      }

      let seo_meta_names = [
        "meta_description",
        "meta_keywords",
        //"meta_title",
        "og_description",
        "og_image",
        "og_title",
        "og_type",
        "twitter_card",
        "twitter_description",
        "twitter_title",
        "twitter_image",
        "twitter_creator",
      ];

      let keysMappings = {
        og_title: "og:title",
        og_description: "og:description",
        meta_description: "description",
        og_image: "og:image",
        //	meta_title: "title",
        meta_keywords: "keywords",
        og_type: "og:type",
        twitter_card: "twitter:card",
        twitter_description: "twitter:description",
        twitter_title: "twitter:title",
        twitter_image: "twitter:image",
        twitter_creator: "twitter:creator",
      };

      seo_meta_names.forEach((key) => {
        if (page.seo[key]) {
          let seo_k = keysMappings[key] || key;
          seo.meta.push({
            name: seo_k,
            content: page.seo[key],
          });
        }
      });

      nuxtApp.runWithContext(() => useHead(seo));
    } catch (e) {
      nuxtApp.runWithContext(() => useHead({ title: "Sun Pyramids Tours" }));
    }
  }

  return { addSeo };
}
