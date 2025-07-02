/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ←  must match your files
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: { extend: {} },
  plugins: [],
};
