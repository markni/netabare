import { defineStore } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import moment from 'moment/moment'

function sampleData(data: any[], sampleSize: number) {
  const newData = []

  for (let i = 0; i < data.length; i += sampleSize) {
    newData.push(data[i])
  }

  return newData
}

export const useArchiveStore = defineStore('archive', {
  state: () => {
    const archives: { [id: number]: Archive } = {}
    const chartOptions = {
      spanGaps: true,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month'
          }
        },
        y: {
          min: 0,
          max: 10,
          ticks: {
            // This ensures that the min and max values are included in the ticks
            stepSize: 1,
            precision: 0,
            includeBounds: true
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
    return { archives, chartOptions }
  },
  actions: {
    async fetchArchive(id: number) {
      if (this.archives[id]) return
      const response = await fetch(`https://api.netaba.re/archive/${id}`)
      if (!response.ok) {
        throw new Error('Resource not found') // or any other error message
      }
      this.archives[id] = await response.json()
    }
  },
  getters: {
    archiveChartData(state) {
      const themeStore = useThemeStore()
      const { secondary } = themeStore

      return (id: number) => {
        const data = state.archives[id].history
          .map((item: History) => {
            return {
              x: item.recordedAt,
              y: item.score
            }
          })
          .filter((item: any) => {
            return moment(item.x).valueOf() >= moment().subtract(6, 'months').valueOf()
          })

        return {
          datasets: [
            {
              type: 'line',
              label: '评分',
              borderColor: [secondary],
              fill: true,
              backgroundColor: [secondary],
              data: sampleData(data, 7)
            }
          ]
        }
      }
    }
  }
})

export interface Archive {
  subject: Subject
  history: History[]
}

export interface Subject {
  id: number
  url: string
  type: number
  name: string
  name_cn: string
  summary: string
  eps: Ep[]
  eps_count: number
  air_date: string
  air_weekday: number
  rating: Rating
  rank: number
  images: Images
  collection: Collection
  crt: Crt[]
  staff: Staff[]
  topic: Topic[]
  blog: Blog[]
}

export interface Ep {
  id: number
  url: string
  type: number
  sort: number
  name: string
  name_cn: string
  duration: string
  airdate: string
  comment: number
  desc: string
  status: string
}

export interface Rating {
  total: number
  count: Count
  score: number
}

export interface Count {
  '1': number
  '2': number
  '3': number
  '4': number
  '5': number
  '6': number
  '7': number
  '8': number
  '9': number
  '10': number
}

export interface Images {
  large: string
  common?: string
  medium: string
  small: string
  grid: string
}

export interface Collection {
  wish: number
  collect: number
  doing: number
  on_hold: number
  dropped: number
}

export interface Crt {
  id: number
  url: string
  name: string
  name_cn: string
  role_name: string
  images: Images
  comment: number
  collects: number
  info: Info
  actors: Actor[]
}

export interface Info {
  name_cn: string
  alias: Alias
  gender: string
  birth: string
  height: string
  weight: string
  source?: string
}

export interface Alias {
  zh?: string
  en: string
  '0'?: string
  '1'?: string
  '2'?: string
  jp?: string
  romaji?: string
}

export interface Actor {
  id: number
  url: string
  name: string
  images: Images
}

export interface Staff {
  id: number
  url: string
  name: string
  name_cn: string
  role_name: string
  images?: Images
  comment: number
  collects: number
  info: Info
  jobs: string[]
}

export interface Topic {
  id: number
  url: string
  title: string
  main_id: number
  timestamp: number
  lastpost: number
  replies: number
  user: User
}

export interface User {
  id: number
  url: string
  username: string
  nickname: string
  avatar: Avatar
  sign: any
}

export interface Avatar {
  large: string
  medium: string
  small: string
}

export interface Blog {
  id: number
  url: string
  title: string
  summary: string
  image: string
  replies: number
  timestamp: number
  dateline: string
  user: User
}

export interface History {
  collect: Collect
  rating: Rating
  bgmId: number
  recordedAt: string
  rank?: number
  score: number
}

export interface Collect {
  wish: number
  collect?: number
  doing?: number
  on_hold?: number
  dropped?: number
}
