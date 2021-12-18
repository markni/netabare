import axios, { AxiosResponse } from "axios";

const api_root = `https://api.netaba.re`;

export interface Archive<S = never, D = never[]> {
  subject: S;
  history: D;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
}

export interface RatingDistributionWithUnrated extends RatingDistribution {
  "-1": number;
}

export interface BgmUser {
  id: number;
  url: string;
  username: string;
  nickname: string;
  avatar: {
    large: string;
    medium: string;
    small: string;
  };
  sign: string;
  usergroup: number;
}

//https://api.netaba.re/user/ruocaled
export interface User {
  count: RatingDistributionWithUnrated;
  gCount: RatingDistribution;
  total: number;
  voted: number;
  stdev: number;
  median: number;
  avg: number;
  user: BgmUser;
}

export const fetchRank = (bgmId: number): Promise<AxiosResponse<Archive>> => {
  return axios.get(`${api_root}/archive/${bgmId}`);
};

export const fetchUser = (bgmUserId: number): Promise<AxiosResponse<User>> => {
  return axios.get(`${api_root}/user/${bgmUserId}`);
};

export const fetchTrending = (): Promise<AxiosResponse<never>> => {
  return axios.get(`${api_root}/trending`);
};

export const fetchPopular = (): Promise<AxiosResponse<never>> => {
  return axios.get(`${api_root}/popular`);
};

export const fetchHistory = (): Promise<AxiosResponse<never>> => {
  return axios.get(`${api_root}/history`);
};
