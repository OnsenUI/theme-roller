import request from '@/api/request';

export default {
  get: request,

  getRootCSS(version) {
    const url = `https://unpkg.com/onsenui@${version}/css-components-src/src/onsen-css-components.css`;
    const headers = { 'Content-Type': 'text/css' };

    return request(url, { headers })
      .then(css => ({ css, url }));
  },
  getThemeCSS(version, name) {
    const url = `https://unpkg.com/onsenui@${version}/css-components-src/src/${name}`;
    const headers = { 'Content-Type': 'text/css' };

    return request(url, { headers });
  },
  getVersions() {
    const url = 'https://api.github.com/repos/OnsenUI/OnsenUI-dist/releases';
    const filter = items => items
      .map(i => i.tag_name)
      .filter(i => i >= '2.2.0')
      .sort()
      .reverse();

    return request(url, { filter });
  },
  getThemes(version) {
    const url = `https://api.github.com/repos/OnsenUI/OnsenUI-dist/contents/css-components-src/src?ref=${version}`;
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
};
