import axios from 'axios'
import { useAppStore } from '@/stores/app.js'

let http = axios.create({
  withCredentials: false
})

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Modify request config here, if needed
    const appStore = useAppStore()
    appStore.setNetworkError(false)
    return config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error)
  }
)

// Response interceptor
http.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response
  },
  (error) => {
    // Handle response errors
    if (error.code === 'ERR_NETWORK') {
      // Handle timeout error
      const appStore = useAppStore()
      appStore.setNetworkError(true)
    }
    return Promise.reject(error)
  }
)

export default http
