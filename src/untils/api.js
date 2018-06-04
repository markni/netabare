import axios from '@/untils/axios';

const api_root = 'api.netaba.re';

export const fetchRank = bgmId => {
  return axios.get(`${window.location.protocol}//${api_root}/rank/${bgmId}`);
};

export const fetchUser = bgmUserId => {
  return axios.get(
    `${window.location.protocol}//${api_root}/user/${bgmUserId}`
  );
};
