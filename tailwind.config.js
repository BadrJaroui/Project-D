/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/layout.js",
    "./app/page.js",
  ],
  darkMode: "class",
  safelist: [
    "dark",
    "dark:bg-black",
    "dark:text-white",
    "bg-white",
    "text-black",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
