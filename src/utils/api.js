import axios from '@/utils/axios'

let api_root = `${window.location.protocol}//api.netaba.re`
if (import.meta.env.MODE === 'development') {
  api_root = 'http://localhost:8888'
}

export const fetchRank = (bgmId) => {
  return axios.get(`${api_root}/subject/${bgmId}`)
}

export const fetchUser = (bgmUserId) => {
  return axios.get(`${api_root}/user/${bgmUserId}`)
}

export const fetchTrending = () => {
  return axios.get(`${api_root}/trending`)
}

export const fetchSeason = () => {
  return axios.get(`${api_root}/season`)
}

export const fetchHistory = () => {
  return axios.get(`${api_root}/history`)
}
