// https://nuxt.com/docs/api/configuration/nuxt-config
import langsConfig from "./i18n/Helpers/config";
import RedirectRules from "./redirect-rules";

const appURL = process.env.APP_URL || "https://new-sunpyramids-demo.vercel.app";
const baseURL = process.env.API_URL || "https://sunpyramidtours.com/api/";
const redirect_rules: any = RedirectRules;

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  ssr: true,
  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
        prefetchOn: 'interaction',
      },
    },
    inlineSSRStyles: true,
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false,
      routes: [],
      ignore: ["/*"],
    },
    externals: {
      inline: ["@googlemaps/markerclusterer"],
    },
  },
  css: ["~/assets/styles/main.scss"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: ["~/plugins/vue3-toastify.js"],
  build: {
    transpile: ["vue3-toastify", "swiper", "@fawmi/vue-google-maps", "@googlemaps/markerclusterer"],
  },
  vite: {
    ssr: {
      noExternal: ["@googlemaps/markerclusterer"],
    },
    build: {
      cssMinify: true,
    },
  },
  modules: [
    "@pinia/nuxt",
    "nuxt-swiper",
    "nuxt-icons",
    "nuxt-lottie",
    [
      "@vee-validate/nuxt",
      {
        autoImports: true,
        componentNames: {
          Form: "VeeForm",
          Field: "VeeField",
          ErrorMessage: "VeeErrorMessage",
        },
      },
    ],
    [
      "@nuxtjs/i18n",
      {
        locales: langsConfig,
        lazy: false,
        langDir: "locales/",
        defaultLocale: "en",
        detectBrowserLanguage: false,
        vueI18nLoader: true,
      },
    ],
    "@nuxt/image",
    "@vercel/speed-insights/nuxt",
  ],
  lottie: {
    componentName: "Lottie", // Optional: Customize the component name
    lottieFolder: "/assets/lottie", // Optional: Customize the Lottie folder path
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [
        {
          src: "https://www.google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn",
          async: true,
          defer: true,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: baseURL,
      appURL: appURL,
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
    domains: ['sunpyramidtours.com', 'pub-5ccb6ad334fb427684d7f3fa11a34197.r2.dev'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  routeRules: {
    "/": {
      swr: 600,
    },
    "/about-us": {
      swr: 3600,
    },
    "/accessible-travel": {
      swr: 3600,
    },
    "/blogs/**": {
      swr: 600,
    },
    "/blog/**": {
      swr: 3600,
    },
    "/tour/**": {
      swr: 1800,
    },
    "/egypt-tours/**": {
      swr: 1800,
    },
    "/egypt-travel-guide": {
      swr: 3600,
    },
    "/egypt-travel-guide/**": {
      swr: 3600,
    },
    "/events": {
      swr: 1800,
    },
    "/event/**": {
      swr: 1800,
    },
    "/faqs": {
      swr: 3600,
    },
    "/rent-car": {
      swr: 3600,
    },
    "/sustainability": {
      swr: 3600,
    },
    "/terms-and-conditions": {
      swr: 3600,
    },
    "/privacy-and-cookies": {
      swr: 3600,
    },
    "/images/**": {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
    "/_ipx/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    "/_nuxt/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    ...(process.env.APP_ENV !== "development"
      ? {
          "/checkout": { ssr: false },
          ...redirect_rules,
        }
      : {}),
  },
});
