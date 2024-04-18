// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchRank } from '@/utils/api.js'
import { useAppStore } from '@/stores/app.js'
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js'
import dayjs from 'dayjs'
import _ from 'lodash'

export const useSubjectStore = defineStore('subject', {
  state: () => ({
    subject: null,
    history: []
  }),
  getters: {
    oneWeekBeforeFirstEpTimestamp: (state) => {
      return state.subject?.eps?.[0]?.airdate
        ? dayjs(state.subject.eps[0].airdate).subtract(1, 'weeks').valueOf()
        : 0
    },
    oneWeekAfterLastEpTimestamp: (state) => {
      return state.subject?.eps?.[state.subject.eps.length - 1]?.airdate
        ? dayjs(state.subject.eps[state.subject.eps.length - 1].airdate)
            .add(1, 'weeks')
            .valueOf()
        : Infinity
    },
    delta: (state) => {
      const { history } = state
      if (!history || history.length < 30) return null
      let current = _.first(history)
      let before = _.nth(history, 29)
      let score = current.score - before.score
      let rank = current.rank - before.rank
      let watching = current.collect?.doing - before.collect?.doing

      return { score, rank, watching }
    },
    combinedData: (state) => {
      const { history } = state
      if (!history) return null
      const rankData = {
        history: []
      }
      const scoreData = {
        history: [],
        one: [],
        ten: []
      }
      const collectionData = {
        history: {}
      }

      // Initialize collection history keys
      history.forEach((h) => {
        if (h.collect) {
          for (let key in h.collect) {
            collectionData.history[key] = collectionData.history[key] || []
          }
        }
      })

      // Process history in one loop
      history.forEach((h) => {
        const x = dayjs(h.recordedAt).valueOf()

        if (h.rank) {
          rankData.history.unshift({ x, y: h.rank })
        }

        if (h.score) {
          scoreData.history.unshift({ x, y: h.score })
        }

        if (h.collect) {
          for (let key in h.collect) {
            if (!collectionData.history[key]) {
              collectionData.history[key] = []
            }
            collectionData.history[key].unshift({ x, y: h.collect[key] })
          }
        }

        if (h.rating?.count) {
          scoreData.ten.unshift({ x, y: h.rating.count[10] || 0 })
          scoreData.one.unshift({ x, y: h.rating.count[1] || 0 })
        }
      })

      return { rankData, scoreData, collectionData }
    }
  },

  actions: {
    async fetchSubject(subjectId) {
      try {
        const fetchSubjectWithLoading = withSmartLoadingUx(fetchRank, {
          delay: 500,
          minimumDisplayTime: 1500,
          setLoadingState: useAppStore().setLongPolling
        })

        const response = await fetchSubjectWithLoading(subjectId)

        this.subject = response.data['subject']
        this.history = response.data['history']
      } catch (error) {
        console.error('Failed to fetch subject:', error)
        // Handle error appropriately
      }
    },
    clearSubject() {
      this.subject = null
    }
  }
})
