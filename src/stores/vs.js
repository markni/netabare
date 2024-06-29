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
  getters: {},

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
          scoreHistory: history
            .map((h) => {
              return [dayjs(h.recordedAt).valueOf(), h.score]
            })
            .filter((h) => h[1] !== null && h[1] !== undefined),
          rankHistory: history
            .map((h) => {
              return [dayjs(h.recordedAt).valueOf(), h.rank]
            })
            .filter((h) => h[1] !== null && h[1] !== undefined)
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
