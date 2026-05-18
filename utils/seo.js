import langsConfig from "~~/i18n/Helpers/config";

const ALL_LOCALES = langsConfig.map((l) => l.code);
const NON_DEFAULT_LOCALES = ALL_LOCALES.filter((c) => c !== "en");

export const getPathWithoutLocale = () => {
  const route = useRoute();
  const fullPath = route?.fullPath || "";
  let segments = fullPath.split("/");
  if (segments.length > 1 && NON_DEFAULT_LOCALES.includes(segments[1])) {
    segments.splice(0, 2);
    return "/" + segments.join("/");
  }
  return fullPath;
};

export const buildCanonicalUrl = (path, locale, appUrl) => {
  let normalized = path.replace(/\/+$/, "") || "/";
  return `${appUrl}${normalized}`;
};

export const generateHreflangLinks = (availableLocales, currentPath, appUrl) => {
  const basePath = getPathWithoutLocale();
  const normalizedBase = basePath === "/" ? "" : basePath;

  const links = [
    {
      rel: "alternate",
      hreflang: "x-default",
      href: `${appUrl}${normalizedBase}`,
    },
  ];

  for (const loc of availableLocales) {
    if (loc === "en") continue; // x-default already covers English
    links.push({
      rel: "alternate",
      hreflang: loc,
      href: `${appUrl}/${loc}${normalizedBase}`,
    });
  }

  return links;
};

export const validateAndParseSchema = (page) => {
  if (!page?.seo?.structure_schema) {
    return null;
  }

  const raw = page.seo.structure_schema;

  // Already parsed by API (object or array)
  if (typeof raw === "object" && raw !== null) {
    if (Array.isArray(raw)) {
      return raw.map((item) => JSON.stringify(item));
    }
    return JSON.stringify(raw);
  }

  // String from dashboard
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Parsed schema is not an object");
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item) => JSON.stringify(item));
      }
      return JSON.stringify(parsed);
    } catch (e) {
      if (process.dev) {
        console.warn(
          "[seo] Invalid structure_schema, skipping:",
          e.message,
          "Raw:",
          raw.substring(0, 100)
        );
      }
      return null;
    }
  }

  return null;
};
