import request from '@/api/request';
import util from '@/util';

const cdn = 'https://unpkg.com/onsenui';
const repo = 'https://api.github.com/repos/OnsenUI/OnsenUI-dist/';

export default {
  get: request,

  urls: {
    cssComponents: version => `${cdn}@${version}/css-components-src/src/onsen-css-components.css`,
    componentsIndex: version => `${cdn}@${version}/css-components-src/src/components/index.css`,
  },

  getThemeCSS(version, name) {
    const url = `${cdn}@${version}/css-components-src/src/${name}`;
    const headers = { 'Content-Type': 'text/css' };

    return request(url, { headers });
  },
  getComponentsIndex(version) {
    const url = this.urls.componentsIndex(version);
    const headers = { 'Content-Type': 'text/css' };

    return request(url, { headers });
  },
  getVersions() {
    const url = `${repo}releases`;
    const filter = items => items
      // split version string into [major, minor, patch] array
      .map(i => i.tag_name.split('.', 3).map(x => parseInt(x, 10)))
      .filter((version) => {
        // true iff version is >= 2.6.0
        const minimum = [2, 6, 0];
        return version.length === 3 &&
          (version[0] > minimum[0] ||
            (version[0] === minimum[0] && version[1] >= minimum[1]));
      })
      // sort by newest version first
      .sort((a, b) => {
        for (let i = 0; i < 3; i++) {
          if (a[i] < b[i]) {
            return 1;
          } else if (a[i] > b[i]) {
            return -1;
          }
        }
        return 0; // versions are equal
      })
      // concat version arrays back into version strings
      .map(version => version.join('.'));

    return request(url, { filter });
  },
  getThemes(version) {
    const url = `${repo}contents/css-components-src/src?ref=${version}`;
    const filter = items => items
      .filter(i => /theme.css$/.test(i.name)
        && !/custom-theme.css$/.test(i.name)) // Fix for v2.8.2
      .reduce((result, theme) => [
        ...result, {
          theme,
          label: theme.name === 'theme.css'
            ? 'Default'
            : util.capitalize(util.toLabel(theme.name.split('.')[0])),
        }], [])
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
