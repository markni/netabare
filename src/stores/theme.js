import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false
  }),
  actions: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      const newTheme = this.isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
    },
    initTheme() {
      this.cleanupLegacyStorage();

      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // If not set in localStorage, check for theme query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const themeParam = urlParams.get('theme');

        if (themeParam === 'dark' || themeParam === 'light') {
          // Use theme from query parameter
          this.isDarkMode = themeParam === 'dark';
          localStorage.setItem('theme', themeParam);
        } else {
          // Default to light mode if not set by user or query
          this.isDarkMode = false;
        }
      }
    },
    cleanupLegacyStorage() {
      const legacyKeys = ['darkMode', 'isDarkMode', 'colorMode'];
      legacyKeys.forEach((key) => {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
        }
      });
    }
  }
});
