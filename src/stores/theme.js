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
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
