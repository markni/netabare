import { acceptHMRUpdate, defineStore } from 'pinia'

export type User = {
  bgmId: string
  avg?: number
  count?: {
    [key: string]: number
  }
  gCount?: {
    [key: string]: number
  }
  median?: number

  stdev?: number

  total?: number

  voted?: number

  user?: {
    avatar: {
      large: string
      medium: string
      small: string
    }
    id: number
    nickname: string
    sign: string
    url: string
    username: string
    usergroup: number
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    const user: User = {
      bgmId: ''
    }
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      barThickness: 35,
      plugins: {
        legend: {
          display: false
        },
        barThickness: 1
      }
    }
    return { user, chartOptions }
  },
  actions: {
    async fetchUser(bgmId: string) {
      try {
        const response = await fetch(`https://api.netaba.re/user/${bgmId}`)
        const data = await response.json()
        this.user = { bgmId, ...data }
      } catch (e) {
        console.error(e)
      }
    }
  },
  getters: {
    barChartData(state) {
      const data = []
      for (const key in state.user.count) {
        if (key !== '-1') {
          data.push({ x: `${key}`, y: state.user.count[key] })
        }
      }
      return {
        datasets: [
          {
            backgroundColor: [
              '#3094FF',
              '#4683EE',
              '#5B73DE',
              '#7162CE',
              '#8652BE',
              '#9C41AE',
              '#B1319E',
              '#C7208E',
              '#DC107E',
              '#F2006E'
            ],
            data
          }
        ]
      }
    },
    statsArray(state) {
      return [
        { name: '看过', value: state.user.total },
        {
          name: '已评',
          value:
            state.user.voted && state.user.total
              ? `${((state.user.voted / state.user.total) * 100).toFixed(0)}%`
              : '?%'
        },
        { name: '均值', value: state.user.avg },
        { name: '中值', value: state.user.median },
        {
          name: '标准差',
          value: state.user.stdev
        }
      ]
    }
  }
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
