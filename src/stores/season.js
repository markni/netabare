// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchSeason } from '@/utils/api.js'
import { useAppStore } from '@/stores/app.js'
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js'
import dayjs from 'dayjs'

export const useSeasonStore = defineStore('season', {
  state: () => ({
    season: []
  }),
  getters: {
    historyData: (state) => {
      if (!state.season) return null
      return state.season.map((entry) => {
        return {
          name: entry.name_cn || entry.name,
          bgmId: entry.bgmId,
          history: entry.history.map((h) => {
            return { x: dayjs(h.recordedAt).valueOf(), y: h.score }
          })
        }
      })
    }
  },

  actions: {
    async fetchSeason() {
      try {
        const fetchSeasonWithLoading = withSmartLoadingUx(fetchSeason, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        })

        const response = await fetchSeasonWithLoading()

        this.season = response.data
      } catch (error) {
        console.error('Failed to fetch season:', error)
        // Handle error appropriately
      }
    },
    clearSeason() {
      this.season = null
    }
  }
})
