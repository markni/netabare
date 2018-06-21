import axios from '@/utils/axios';

let api_root = `${window.location.protocol}//api.netaba.re`;
if (
  window.location.host.startsWith('192.168.0.14') ||
  window.location.host.startsWith('localhost')
) {
  api_root = 'http://45.33.57.234:8888';
  // api_root = 'http://localhost:8888';
}

export const fetchRank = bgmId => {
  return axios.get(`${api_root}/archive/${bgmId}`);
};

export const fetchUser = bgmUserId => {
  return axios.get(`${api_root}/user/${bgmUserId}`);
};

export const fetchTrending = () => {
  return axios.get(`${api_root}/trending`);
};

export const fetchPopular = () => {
  return axios.get(`${api_root}/popular`);
};

export const fetchHistory = () => {
  return axios.get(`${api_root}/history`);
};
