// https://nuxt.com/docs/api/configuration/nuxt-config
import langsConfig from "./i18n/Helpers/config";
import RedirectRules from "./redirect-rules";

const appURL = process.env.APP_URL || "https://sunpyramids.vercel.app";
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
  },
  css: [
    "~/assets/styles/main.scss",
    "swiper/css",
    "swiper/css/pagination",
    "swiper/css/navigation",
    "swiper/css/free-mode",
    "swiper/css/thumbs",
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: ["~/plugins/vue3-toastify.client.js"],
  build: {
    transpile: ["vue3-toastify", "swiper"],
  },
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("swiper")) return "vendor-swiper";
              if (id.includes("@vuepic/vue-datepicker")) return "vendor-datepicker";
              if (id.includes("vue-awesome-paginate")) return "vendor-paginate";
              if (id.includes("vue3-toastify")) return "vendor-toastify";
              if (id.includes("vue-i18n") || id.includes("@nuxtjs/i18n")) return "vendor-i18n";
              if (id.includes("vee-validate")) return "vendor-forms";
              if (id.includes("pinia") || id.includes("@pinia")) return "vendor-state";
              if (id.includes("vue-router") || id.includes("@vue/runtime") || id.includes("@vue/shared") || id.includes("@vue/reactivity")) return "vendor-vue";
              if (id.includes("nuxt") && !id.includes("nuxt-swiper") && !id.includes("nuxt-icons")) return "vendor-nuxt";
              if (id.includes("@fawmi/vue-google-maps") || id.includes("@googlemaps")) return "vendor-maps";
              return "vendor-common";
            }
          },
        },
      },
    },
  },
  modules: [
    "@pinia/nuxt",
    "nuxt-swiper",
    "nuxt-icons",
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
        lazy: true,
        langDir: "locales/",
        defaultLocale: "en",
        detectBrowserLanguage: false,
        vueI18nLoader: true,
      },
    ],
    "@nuxt/image",
    "@vercel/speed-insights/nuxt",
  ],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://sunpyramidtours.com" },
        { rel: "dns-prefetch", href: "https://sunpyramidtours.com" },
        { rel: "preconnect", href: "https://pub-5ccb6ad334fb427684d7f3fa11a34197.r2.dev" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/TripSans-Regular.woff2", crossorigin: "anonymous" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/TripSans-Medium.woff2", crossorigin: "anonymous" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/TripSans-Bold.woff2", crossorigin: "anonymous" },
      ],
      script: [],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: baseURL,
      appURL: appURL,
    },
  },

  image: {
    // Don't set provider explicitly — let @nuxt/image auto-detect:
    // On Vercel it uses /_vercel/image; elsewhere it falls back to IPX.
    quality: 80,
    format: ['webp'],
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
    "/_vercel/image": {
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
