/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors'
import { GOLD, TEAL, RED, IVORY, GRAY, BLUE } from './src/constants/colors.js'
import plugin from 'tailwindcss/plugin'

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
      blue: BLUE,
      darkGray: GRAY,
      lightGray: '#a6a6a6'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['source-han-serif-sc', 'source-han-serif-japanese', '宋体', '新宋体']
    },
    extend: {}
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.horizontal-tb': {
          writingMode: 'horizontal-tb'
        },
        '.vertical-rl': {
          writingMode: 'vertical-rl'
        },
        '.vertical-lr': {
          writingMode: 'vertical-lr'
        }
      }
      addUtilities(newUtilities)
    })
  ]
}
