/** @type {import('tailwindcss').Config} */

import {
  GOLD,
  TEAL,
  RED,
  IVORY,
  DARK_GRAY,
  LIGHT_GRAY,
  BLUE,
  PINK,
  BLACK
} from './src/constants/colors.js';
import plugin from 'tailwindcss/plugin';
import colors from 'tailwindcss/colors.js';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Add this line to enable dark mode
  theme: {
    colors: {
      teal: TEAL,
      paper: {
        DEFAULT: IVORY, // Light mode color
        dark: DARK_GRAY // Dark mode color
      },
      gold: GOLD,
      red: RED,
      blue: BLUE,
      darkGray: DARK_GRAY,
      pink: PINK,
      lightGray: LIGHT_GRAY,
      black: BLACK,
      gray: colors.gray,
      white: IVORY,
      transparent: colors.transparent
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
      };
      addUtilities(newUtilities);
    })
  ]
};
