<template>
  <button
    @click="themeStore.toggleDarkMode"
    class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
  >
    {{ themeStore.isDarkMode ? '🌞 Light' : '🌙 Dark' }}
  </button>
</template>

<script setup>
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
</script>
