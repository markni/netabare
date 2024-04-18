// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchHistory } from '@/utils/api.js'
import { useAppStore } from '@/stores/app.js'
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js'
import _ from 'lodash'
import dayjs from 'dayjs'

const currentYear = parseInt(dayjs().year())

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: null,
    dic: {},
    startingYear: currentYear - 5,
    endingYear: currentYear,
    minScore: 0,
    maxScore: 10
  }),
  getters: {
    yearlyData: (state) => {
      if (!state.history) return null
      let yearlyData = {}
      state.history
        .filter(({ score, air_date }) => {
          return (
            score >= state.minScore &&
            score <= state.maxScore &&
            dayjs(air_date).year() >= state.startingYear &&
            dayjs(air_date).year() <= state.endingYear
          )
        })
        .forEach(({ air_date, score }) => {
          let year = dayjs(air_date).year()
          if (!yearlyData[year]) {
            yearlyData[year] = { score: 0, count: 0 }
          }
          yearlyData[year].score += score
          yearlyData[year].count++
        })
      return Object.keys(yearlyData).map((year) => {
        return {
          x: dayjs().year(year).startOf('year').valueOf(),
          y: parseFloat((yearlyData[year].score / yearlyData[year].count).toFixed(4))
        }
      })
    },
    historyData: (state) => {
      if (!state.history) return null
      return state.history
        .filter(({ score, air_date }) => {
          return (
            score >= state.minScore &&
            score <= state.maxScore &&
            dayjs(air_date).year() >= state.startingYear &&
            dayjs(air_date).year() <= state.endingYear
          )
        })
        .map(({ air_date, score, rank }) => {
          return [
            dayjs(air_date).valueOf(),
            parseFloat(score.toFixed(4) + '' + _.padStart(rank, 5, '0'))
          ]
        })
    }
  },
  actions: {
    setStartingYear(year) {
      this.startingYear = year
    },
    setEndingYear(year) {
      this.endingYear = year
    },
    setMinScore(score) {
      this.minScore = score
    },
    setMaxScore(score) {
      this.maxScore = score
    },
    async fetchHistory() {
      try {
        const fetchHistoryWithLoading = withSmartLoadingUx(fetchHistory, {
          setLoadingState: useAppStore().setLongPolling,
          minimumDisplayTime: 2000,
          delay: 0
        })

        const response = await fetchHistoryWithLoading()

        this.history = response.data

        this.history.forEach(({ rank, air_date, bgmId, name, name_cn, score }) => {
          this.dic[rank] = { rank, bgmId, name, name_cn, score, air_date }
        })
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Handle error appropriately
      }
      return this.history
    }
  }
})
