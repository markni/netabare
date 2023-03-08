import { acceptHMRUpdate, defineStore } from 'pinia'

interface HistoryItem {
  bgmId: string
  name: string
  name_cn: string
  air_date: string
  score: number
  total: number
  rank: number
}

export const useHistoryStore = defineStore('history', {
  state: () => {
    const history: HistoryItem[] = []
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'year'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.raw.n}: ${context.raw.y}分`
            }
          }
        }
      }
    }
    return { history, chartOptions }
  },
  actions: {
    async fetchHistory() {
      const response = await fetch('https://api.netaba.re/history')
      if (!response.ok) {
        throw new Error('Resource not found') // or any other error message
      }
      this.history = await response.json()
    }
  },
  getters: {
    bubbleChartData(state) {
      const data = state.history
        .map((item: HistoryItem) => {
          return {
            x: item.air_date,
            y: item.score,
            r: item.total,
            n: item.name
          }
        })
        .filter(
          (item: any) =>
            item.r > 50 && new Date(item.x).getTime() > new Date('2015-01-01').getTime()
        )
      console.log(data)
      return {
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: data
          }
        ]
      }
    }
  }
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHistoryStore, import.meta.hot))
}
