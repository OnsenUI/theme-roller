import request from '@/api/request';

const cdn = 'https://unpkg.com/onsenui';
const repo = 'https://api.github.com/repos/OnsenUI/OnsenUI-dist/';

export default {
  get: request,

  urls: {
    cssComponents: version =>  `${cdn}@${version}/css-components-src/src/onsen-css-components.css`,
  },

  getThemeCSS(version, name) {
    const url = `${cdn}@${version}/css-components-src/src/${name}`;
    const headers = { 'Content-Type': 'text/css' };

    return request(url, { headers });
  },
  getVersions() {
    const url = `${repo}releases`;
    const filter = items => items
      .map(i => i.tag_name)
      .filter(i => i >= '2.2.0')
      .sort()
      .reverse();

    return request(url, { filter });
  },
  getThemes(version) {
    const url = `${repo}contents/css-components-src/src?ref=${version}`;
    const filter = items => items
      .reduce((result, theme) => {
        if (/theme.css$/.test(theme.name)) {
          result.push({
            theme,
            label: theme.name === 'theme.css'
              ? 'Default'
              : theme.name.split('.')[0].replace('-', ' ').replace(/(^|\s)([a-z])/g, m => m.toUpperCase()),
          });
        }

        return result;
      }, [])
      .sort((a, b) => a.theme.name.length > b.theme.name.length);

    return request(url, { filter });
  },
  getBrowserslist() {
    // Use latest always
    const url = `${cdn}/package.json`;
    const filter = pkg => pkg
      .babel.presets[0][1].targets.browsers;

    return request(url, { filter });
  },
};
