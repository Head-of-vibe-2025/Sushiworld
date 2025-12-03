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
          DEFAULT: "#FF6B6B",
          dark: "#EE5A52",
          light: "#FF8787"
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

