<template>
  <div class="app">
    <TRSide class="app__side" />
    <div class="app__main">
      <TRHeaderToolbar @version="updateContent" @theme="updateTheme" />
      <div class="app__content">
        <TRPreviewList />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import ancss from 'ancss';
import postcss from 'postcss';
import postcssCssnext from 'postcss-cssnext';
import postcssUrlResolver from 'postcss-url-resolver';
import TRSide from '@/components/TRSide';
import TRHeaderToolbar from '@/components/TRHeaderToolbar';
import TRPreviewList from '@/components/TRPreviewList';
import api from '@/api';

export default {
  name: 'App',

  components: {
    TRSide,
    TRHeaderToolbar,
    TRPreviewList,
  },

  data() {
    return {
      styleElement: document.createElement('style'),
      rootCSS: '',
      theme: '',
      browserslist: [],
    };
  },

  computed: {
    ...mapMutationState([
      'cssComponents',
      'fullComponentsIndex',
      'customComponentsIndex',
      'versions',
      'version',
      'themes',
    ]),
    style: {
      get() {
        return this.styleElement.textContent;
      },
      set(style) {
        this.styleElement.textContent = style;
      },
    },
    preCompiledCSS() {
      return this.rootCSS
        .replace(/^(\s*@import.+theme\.css.+\n)/m, this.theme)
        .replace(/^(\s*@import.+components\/index\.css.+\n)/m, this.customComponentsIndex || this.fullComponentsIndex);
    },
  },

  watch: {
    preCompiledCSS(precss) {
      this.processCSS({
        css: precss,
        cssnext: true,
        from: api.urls.componentsIndex(this.version),
        base64: true,
      })
        .then((css) => {
          this.style = css;
          this.cssComponents = ancss.parse(css, {
            detect: line => line.match(/^~/),
          });
        });
    },
  },

  created() {
    this.styleElement.id = 'onsen-css-components';
    this.styleElement.type = 'text/css';
    document.head.insertBefore(this.styleElement, document.head.querySelector('style'));

    Promise.all([api.getVersions(), api.getBrowserslist()])
      .then(([versions, browserslist]) => {
        this.versions = versions;
        [this.version] = versions;
        this.browserslist = browserslist;
        this.updateContent(this.version);
      });
  },

  beforeDestroy() {
    this.styleElement.remove();
    this.styleElement = null;
  },

  methods: {
    fetchRootCSS(version) {
      return this.processCSS({
        from: api.urls.cssComponents(version),
        base64: true,
        exclude: /(theme|components\/index).css$/,
      });
    },
    fetchThemeCSS(version, name) {
      return api.getThemeCSS(version, name);
    },
    fetchThemes(version) {
      return api.getThemes(version).then((themes) => {
        this.themes = themes;
        return this.fetchThemeCSS(version, themes[0].theme.name);
      });
    },
    fetchComponentsIndex(version) {
      return api.getComponentsIndex(version).then((index) => {
        this.fullComponentsIndex = index;
      });
    },
    updateContent(version) {
      Promise.all([
        this.fetchRootCSS(version),
        this.fetchThemes(version),
        this.fetchComponentsIndex(version),
      ])
        .then((result) => {
          this.version = version;
          [this.rootCSS, this.theme] = result;
        });
    },
    updateTheme(name) {
      this.fetchThemeCSS(this.version, name)
        .then((theme) => {
          this.theme = theme;
        });
    },
    processCSS({
      from = '',
      base64 = false,
      exclude = null,
      css = `@import url('${from}');`,
      cssnext = false,
    } = {}) {
      const plugins = [];

      if (from) {
        plugins.push(postcssUrlResolver({
          request: opt => api.get(opt.href),
          base64,
          exclude,
        }));
      }

      if (cssnext) {
        plugins.push(postcssCssnext({ browsers: this.browserslist }));
      }

      return postcss(plugins)
        .process(css, { from })
        .then(result => result.css);
    },
  },
};
</script>

<style scoped>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  display: flex;
}

.app__side {
  min-width: 200px;
}

.app__main {

}

.app__content {
  padding: var(--content-padding);
  margin: 10px 0 50vh;
}
</style>
