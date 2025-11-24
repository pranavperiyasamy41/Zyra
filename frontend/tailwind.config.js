/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <-- This is the crucial fix
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}