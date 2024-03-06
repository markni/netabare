import axios from 'axios';
import wrapper from 'axios-cache-plugin';

let http = axios.create({
  withCredentials: false,
});

let httpProxy = wrapper(http, {
  maxCacheSize: 100,
});

httpProxy.__addFilter(/netaba/i);

export default httpProxy;
