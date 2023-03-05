/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      serif: ['source-han-serif-sc', 'serif']
    },
    extend: {}
  },
  plugins: []
}
