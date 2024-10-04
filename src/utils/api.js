import axios from '@/utils/axios';

let api_root = 'https://api.netaba.re';

if (import.meta.env.MODE === 'development') {
  api_root = import.meta.env.VITE_API_ROOT || api_root;
}

export const fetchRank = (bgmId) => {
  return axios.get(`${api_root}/subject/${bgmId}`);
};

export const fetchUser = (bgmUserId) => {
  return axios.get(`${api_root}/user/${bgmUserId}`);
};

export const fetchTrending = () => {
  return axios.get(`${api_root}/trending`);
};

export const fetchSeason = (year, month) => {
  let url = `${api_root}/season`;
  if (year && month) {
    url += `/${year}/${month}`;
  }
  return axios.get(url);
};

export const fetchHistory = () => {
  return axios.get(`${api_root}/history`);
};
