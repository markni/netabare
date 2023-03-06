import { defineStore } from 'pinia'

export type User = {
  bgmId: string
  avg?: number
  count?: {
    [key: number]: number
  }
  gCount?: {
    [key: number]: number
  }
  median?: number

  stdev?: number

  total?: number

  voted?: number
}

export const useUserStore = defineStore('user', {
  state: () => {
    const user: User = {
      bgmId: ''
    }
    return { user }
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
  getters: {}
})
