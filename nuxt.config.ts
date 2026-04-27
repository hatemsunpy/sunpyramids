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
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false, // Disable automatic link crawling
      routes: [], // Empty array means no routes will be prerendered
      ignore: ["/*"], // Alternative: ignore all routes
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
    transpile: ["vue3-toastify", "swiper", "@fawmi/vue-google-maps"],
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

  routeRules: {
    ...(process.env.APP_ENV !== "development"
      ? {
          "/checkout": { ssr: false },
          ...redirect_rules,
        }
      : {}),
  },
});
