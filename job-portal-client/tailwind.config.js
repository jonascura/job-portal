/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary" : "#141414",
        "blue": "#2274A5",
        "aqua": "#56E39F",
        "mint": "#59C9A5",
        "feldgrau": "#5B6C5D",
        "raisin-black": "#3B2C35",
        "dark-purple": "#2A1F2D",
        "gunmetal": "#202C39",
        "midnight-green": "#023C40",
        "tomato": "#FE4A49",
      }
    },
  },
  plugins: [],
}