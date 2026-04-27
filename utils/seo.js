export const getPathWithoutLocale = () => {
  let segments = useRoute().fullPath.split("/");
  if (segments.length > 1) {
    const locales = ["fr", "de", "it", "pt", "es", "zh"];
    if (locales.includes(segments[1])) {
      segments.splice(0, 2);
      return "/" + segments.join("/");
    }
  }
  return useRoute().fullPath;
};

export const pageStructureSchema = (page) => {
  if (page.seo["structure_schema"]) {
    try {
      return JSON.parse(page.seo["structure_schema"]);
    } catch (e) {
      return null;
    }
  }
  return null;
};
