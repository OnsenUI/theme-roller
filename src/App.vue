<template>
  <div class="app">
    <TRHeaderToolbar @version="updateContent" @theme="updateTheme" />
    <div class="app__content">
      <TRPreviewList :components="annotations" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ancss from 'ancss';
import postcss from 'postcss';
import postcssCssnext from 'postcss-cssnext';
import postcssUrlResolver from 'postcss-url-resolver';
import TRHeaderToolbar from '@/components/TRHeaderToolbar';
import TRPreviewList from '@/components/TRPreviewList';
import api from '@/api';

export default {
  name: 'App',

  components: {
    TRHeaderToolbar,
    TRPreviewList,
  },

  data() {
    return {
      styleElement: document.createElement('style'),
      rootCSS: '',
      theme: '',
      componentsIndex: '',
      browserslist: [],
    };
  },

  computed: {
    ...mapState(['components']),
    annotations() {
      return this.components.map(c => c.annotation);
    },
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
        .replace(/^(\s*@import.+components\/index\.css.+\n)/m, this.componentsIndex);
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
          this.setComponents(ancss.parse(css, {
            detect: line => line.match(/^~/),
          }));
        });
    },
  },

  created() {
    this.styleElement.id = 'onsen-css-components';
    this.styleElement.type = 'text/css';
    document.head.insertBefore(this.styleElement, document.head.querySelector('style'));

    Promise.all([api.getVersions(), api.getBrowserslist()])
      .then(([versions, browserslist]) => {
        [this.version] = versions;
        this.setVersions(versions);
        this.browserslist = browserslist;
        this.updateContent(this.version);
      });
  },

  beforeDestroy() {
    this.styleElement.remove();
    this.styleElement = null;
  },

  methods: {
    ...mapMutations(['setComponents', 'setVersions', 'setThemes']),
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
        this.setThemes(themes);
        return this.fetchThemeCSS(version, themes[0].theme.name);
      });
    },
    fetchComponentsIndex(version) {
      return api.getComponentsIndex(version).then((index) => {
        this.componentsIndex = index;
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
}

.app__content {
  padding: var(--content-padding);
  margin: 10px 0 50vh;
}
</style>
