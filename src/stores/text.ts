import { defineStore } from 'pinia'

export const useTextStore = defineStore('text', {
  state: () => {
    const texts: { en: string; zh: string }[] = [
      { en: '404', zh: '四〇四' },
      { en: 'Back to Home', zh: '返回首页' },
      { en: 'History', zh: '评分分布' },
      { en: 'Trend', zh: '条目趋势' },
      { en: 'User', zh: '个人评分' }
    ]

    return { texts }
  },
  actions: {},
  getters: {
    getText(state) {
      return (key: string) => {
        const text = state.texts.find((item) => item.zh === key)
        return text?.zh ?? '' //return zh if found, otherwise return empty string
      }
    },
    getAltText(state) {
      return state.texts.map((item) => item.zh).join('')
    }
  }
})
