// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchUser } from '@/utils/api.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    // Define getters if necessary, for example:
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    async fetchUser(userId) {
      try {
        const response = await fetchUser(userId)
        this.user = response.data
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Handle error appropriately
      }
    },
    clearUser() {
      this.user = null
    }
  }
})
