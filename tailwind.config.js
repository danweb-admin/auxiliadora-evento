/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef0ff',
          100: '#d9dcff',
          200: '#b3b7ff',
          300: '#8c92ff',
          400: '#666dff',
          500: '#4d54f0',
          600: '#3936CD',
          700: '#2f2bb0',
          800: '#252193',
          900: '#1b1776'
        }
      }
    },
  },
  plugins: [],
}