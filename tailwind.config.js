/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EA3886",
          dark: "#EA3886",
          light: "#EA3886"
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          dark: "#3BA99F",
          light: "#6EDDD4"
        }
      }
    },
  },
  plugins: [],
}

