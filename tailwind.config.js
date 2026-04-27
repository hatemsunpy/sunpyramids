/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      transitionProperty: {
        background: "background-size, background-position",
      },
      backgroundSize: {
        "110": "110% 110%",
      },
      colors: {
        primary: "#163A96",
        secondary: "#F7951D",
        third: "#eeeeee",
        dark: "#dedede",
        textDark: "#1D1F1F",
        textLight: "#A5A5A5",
      },
    },
  },
  plugins: [],
};
