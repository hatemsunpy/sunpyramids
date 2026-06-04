const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // PurgeCSS: production only
    ...(process.env.NODE_ENV === 'production'
      ? [purgecss({
          content: [
            './components/**/*.vue',
            './pages/**/*.vue',
            './layouts/**/*.vue',
            './app.vue',
            './plugins/**/*.{js,ts}',
            './composables/**/*.{js,ts}',
          ],
          safelist: {
            standard: [],
            deep: [],
            greedy: [
              /^nuxt-icon/,
              /^swiper-/,
              /^vee-/,
              /^error/,
              /^is-active/,
              /^is-open/,
              /^Toastify/,
              /^scaleBG/,
            ],
          },
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        })]
      : []),
  ],
}
