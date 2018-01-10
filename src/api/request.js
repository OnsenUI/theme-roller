import axios from 'axios';
import cache from '@/api/cache';

axios.interceptors.response.use(undefined, (error) => {
  // Unpkg sometimes does not have files cached
  if (error.response.status === 404 && error.config && !error.config.isRetry) {
    error.config.isRetry = true;
    console.info('HTTP error - Retrying after 3 seconds.'); // eslint-disable-line
    return new Promise(resolve => setTimeout(() => resolve(axios(error.config)), 3000));
  }

  return Promise.reject(error);
});

export default function request(uri, {
  filter = res => res,
  headers = { 'Content-Type': 'application/json' },
} = {}) {
  if (cache.get(uri)) {
    return Promise.resolve(cache.get(uri));
  }

  return axios.get(uri, { headers })
    .then(res => cache.set(uri, filter(res.data)));
}
