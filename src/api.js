import axios from 'axios';

const get = url => axios.get(url).then(res => res.data);

export default {
  getCSS(version = 'latest') {
    return get(`https://unpkg.com/onsenui@${version}/css/onsen-css-components.css`);
  },
  getVersions() {
    return get('https://api.github.com/repos/OnsenUI/OnsenUI-dist/releases')
      .then(items => items
        .map(i => i.tag_name)
        .filter(i => i >= '2.2.0')
        .sort()
        .reverse());
  },
  // https://api.github.com/repos/OnsenUI/OnsenUI-dist/contents/css-components-src/src?ref=2.8.2
};
