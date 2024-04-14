/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors'
import { GOLD, TEAL, RED, IVORY, GRAY } from './src/constants/colors.js'

export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  content: [],
  theme: {
    colors: {
      ...colors,
      mint: TEAL,
      paper: IVORY,
      gold: GOLD,
      blood: RED,
      darkGray: GRAY,
      lightGray: '#f5f5f5'
    },
    extend: {}
  },
  plugins: []
}
