import axios from 'axios';

let http = axios.create({
  withCredentials: false,
});

export default http;
