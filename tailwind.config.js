/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
      colors: {
        chartreuse: "#EBFE53",
        "oxford-blue": "#0F172A",
      },
    },
  },
  plugins: [],
};
