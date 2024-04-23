// Importing Pinia and other utilities
import { defineStore } from 'pinia'
import { fetchRank } from '@/utils/api.js'
import { useAppStore } from '@/stores/app.js'
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js'
import dayjs from 'dayjs'
import { BLUE, PINK } from '@/constants/colors.js'

export const useVsStore = defineStore('vs', {
  state: () => ({
    subjects: [null, null],
    histories: [null, null]
  }),
  getters: {
    epsData: (state) => {
      if (!state.subject) return null
      return state.subject.eps
        .filter((ep) => ep.type === 0 && ep.airdate)
        .reduce((acc, ep) => {
          const airdateValue = dayjs(`${ep.airdate}T00:00:00+08:00`).valueOf()
          if (!acc[airdateValue]) {
            acc[airdateValue] = []
          }
          acc[airdateValue].push(ep)
          return acc
        }, {})
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
    async fetchSubject(subjectId, index) {
      try {
        useAppStore().setNotFoundSubjectError(false)
        const fetchSubjectWithLoading = withSmartLoadingUx(fetchRank, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        })

        const response = await fetchSubjectWithLoading(subjectId)

        this.subjects[index] = response.data['subject']
        const history = response.data['history']
        const subject = response.data['subject']
        this.histories[index] = {
          color: index === 0 ? BLUE : PINK,
          name: subject.name_cn || subject.name,
          bgmId: subjectId,
          //todo: fix sorting in backend instead
          scoreHistory: history
            .map((h) => {
              return { x: dayjs(h.recordedAt).valueOf(), y: h.score }
            })
            .sort((a, b) => a.x - b.x),
          rankHistory: history
            .map((h) => {
              return { x: dayjs(h.recordedAt).valueOf(), y: h.rank }
            })
            .sort((a, b) => a.x - b.x)
        }
      } catch (error) {
        useAppStore().setNotFoundSubjectError(true)
        console.error('Failed to fetch subject:', error)
        // Handle error appropriately
      }
    },
    clearSubject() {
      this.subject = null
    }
  }
})
