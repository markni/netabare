// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchUser } from '@/utils/api.js'
import { useAppStore } from '@/stores/app.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    username: (state) => {
      return state?.user?.user?.username || state?.user?.user?.id || ''
    },
    globalData: (state) => {
      if (!state.user) return null

      let UIData = state.user
      let g = []
      for (let key in UIData.gCount) {
        if (key !== '-1') {
          g.push({ x: parseInt(key), y: UIData.gCount[key] })
        }
      }

      return g
    },
    userData: (state) => {
      if (!state.user) return null

      let UIData = state.user
      let r = []
      for (let key in UIData.count) {
        if (key !== '-1') {
          r.push({ x: parseInt(key), y: UIData.count[key] })
        }
      }

      return r
    }
  },
  actions: {
    async fetchUser(userId) {
      try {
        let startTime
        const timeoutId = setTimeout(() => {
          useAppStore().setLongPolling(true)
          startTime = Date.now()
        }, 500)

        const response = await fetchUser(userId)
        useAppStore().setLongPolling(false)

        // Clear the timeout if the request finishes before 500ms
        clearTimeout(timeoutId)
        // Ensure long polling is disabled when the request is complete
        const elapsedTime = Date.now() - startTime
        const remainingTime = 1000 - elapsedTime // Ensure loading for at least 1000ms

        if (remainingTime > 0) {
          setTimeout(() => {
            useAppStore().setLongPolling(false)
          }, remainingTime)
        }

        this.user = response.data
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Handle error appropriately
      }
      return this.user
    },
    clearUser() {
      this.user = null
    }
  }
})
