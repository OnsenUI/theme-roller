import axios from 'axios';
import cache from '@/api/cache';

const get = (uri, filter = res => res) => {
  if (cache.get(uri)) {
    return Promise.resolve(cache.get(uri));
  }

  return axios.get(uri)
    .then(res => cache.set(uri, filter(res.data)));
};

export default {
  getCSS(version = 'latest') {
    const url = `https://unpkg.com/onsenui@${version}/css/onsen-css-components.css`;
    return get(url);
  },
  getVersions() {
    const url = 'https://api.github.com/repos/OnsenUI/OnsenUI-dist/releases';
    return get(url, items => items
      .map(i => i.tag_name)
      .filter(i => i >= '2.2.0')
      .sort()
      .reverse());
  },
};
