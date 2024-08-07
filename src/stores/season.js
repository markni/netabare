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
    rateData: (state) => {
      if (!state.season) return null
      let extreme = 0
      const positive = state.season.map((entry) => {
        if (entry.history[entry.history.length - 1].rating.count['10'] > extreme) {
          extreme = entry.history[entry.history.length - 1].rating.count['10']
        }
        return {
          name: entry.name_cn || entry.name,
          y: entry.history[entry.history.length - 1].rating.count['10']
        }
      })
      const negative = state.season.map((entry) => {
        if (entry.history[entry.history.length - 1].rating.count['1'] > extreme) {
          extreme = entry.history[entry.history.length - 1].rating.count['1']
        }
        return {
          name: entry.name_cn || entry.name,
          y: -entry.history[entry.history.length - 1].rating.count['1']
        }
      })

      return { positive, negative, extreme }
    },
    historyData: (state) => {
      if (!state.season) return null
      return state.season.map((entry) => {
        return {
          name: entry.name_cn || entry.name,
          bgmId: entry.bgmId,
          scoreHistory: entry.history
            .map((h) => [dayjs(h.recordedAt).valueOf(), h.score])
            .filter((h) => h[1]),
          rankHistory: entry.history
            .map((h) => [dayjs(h.recordedAt).valueOf(), h.rank])
            .filter((h) => h[1])
        }
      })
    }
  },

  actions: {
    async fetchSeason(year, month) {
      try {
        const fetchSeasonWithLoading = withSmartLoadingUx(() => fetchSeason(year, month), {
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
