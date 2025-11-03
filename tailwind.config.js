/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D87D4A",      
        secondary: "#101010",     // Deep black background
        lightGray: "#F1F1F1",
        darkGray: "#4C4C4C",
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        card: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}
