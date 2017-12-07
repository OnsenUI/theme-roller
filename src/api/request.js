import axios from 'axios';
import cache from '@/api/cache';

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
