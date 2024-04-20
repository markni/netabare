// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchTrending } from '@/utils/api.js'
import { useAppStore } from '@/stores/app.js'
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js'

export const useTrendingStore = defineStore('trending', {
  state: () => ({
    up: [],
    down: [],
    done: [],
    popular: []
  }),
  getters: {},
  actions: {
    async fetchTrending() {
      if (this.up.length > 0) return
      try {
        const fetchTrendingWithLoading = withSmartLoadingUx(fetchTrending, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        })

        const response = await fetchTrendingWithLoading()

        this.up = response.data.up
        this.down = response.data.down
        this.done = response.data.done

        // const popular = await fetchPopular()
        //
        // this.popular = popular.data
      } catch (error) {
        console.error('Failed to fetch trending:', error)
        // Handle error appropriately
      }
    }
  }
})
