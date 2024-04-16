// Importing Pinia and other utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    networkError: false
  }),
  getters: {},
  actions: {
    setNetworkError(value) {
      this.networkError = value
    }
  }
})
