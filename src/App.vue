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
import cssnext from 'postcss-cssnext';
import urlResolver from 'postcss-url-resolver';
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
      return this.rootCSS.replace(/^(\s*@import.+theme\.css.+\n)/m, this.theme);
    },
  },

  watch: {
    preCompiledCSS(precss) {
      postcss([cssnext({ browsers: this.browserslist })])
        .process(precss)
        .then((result) => {
          this.style = result.css;
          this.setComponents(ancss.parse(result.css, { detect: line => line.match(/^~/) }));
          return result.css;
        });
    },
  },

  created() {
    this.styleElement.id = 'onsen-css-components';
    this.styleElement.type = 'text/css';
    document.head.insertBefore(this.styleElement, document.querySelector('style'));

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
    fetchThemes(version) {
      return api.getThemes(version).then((themes) => {
        this.setThemes(themes);
        return this.fetchThemeCSS(version, themes[0].theme.name);
      });
    },
    fetchRootCSS(version) {
      const url = api.urls.cssComponents(version);
      const css = `@import url('${url}');`;

      return postcss([
        urlResolver({
          request: opt => api.get(opt.href),
          base64: true,
          exclude: /theme.css$/,
        }),
      ])
        .process(css, { from: url })
        .then(res => res.css);
    },
    fetchThemeCSS(version, name) {
      return api.getThemeCSS(version, name);
    },
    updateContent(version) {
      Promise.all([
        this.fetchRootCSS(version),
        this.fetchThemes(version),
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
