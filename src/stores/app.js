// Importing Pinia and other utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    networkError: false,
    longPolling: false
  }),
  getters: {},
  actions: {
    setNetworkError(value) {
      this.networkError = value
    },
    setLongPolling(value) {
      this.longPolling = value
    }
  }
})
