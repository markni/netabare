import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => {
    let theme = 'light'
    const localSetting = localStorage.getItem('theme')
    if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      theme = 'dark'
    }
    if (localSetting) {
      theme = localSetting
    }
    return { theme }
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
    }
  },
  getters: {
    isDark(): boolean {
      return this.theme === 'dark'
    }
  }
})
