<template>
  <div class="app">
    <TRSide class="app__side" />
    <div class="app__main">
      <TRHeaderToolbar @version="updateAllContent" @theme="updateOnlyTheme" />
      <div class="app__content">
        <TRPreviewList />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import ancss from 'ancss';
import CSSProcessor from '@/css-processor';
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
    };
  },

  computed: {
    ...mapMutationState([
      'browserslist',
      'cssComponents',
      'customVariables',
      'fullComponentsIndex',
      'rootCSS',
      'theme',
      'themes',
      'version',
      'versions',
    ]),
    style: {
      get() {
        return this.styleElement.textContent;
      },
      set(style) {
        this.styleElement.textContent = style;
      },
    },
    preCSS() {
      return CSSProcessor
        .replace(this.rootCSS, this.theme, this.fullComponentsIndex);
    },
  },

  watch: {
    customVariables() {
      this.updateStyle();
    },
  },

  created() {
    this.styleElement.id = 'onsen-css-components';
    this.styleElement.type = 'text/css';
    document.head.insertBefore(this.styleElement, document.head.querySelector('style'));

    Promise.all([api.getVersions(), api.getBrowserslist()])
      .then(([versions, browserslist]) => {
        this.versions = versions;
        this.browserslist = browserslist;
        this.updateAllContent(versions[0]);
      });
  },

  beforeDestroy() {
    this.styleElement.remove();
    this.styleElement = null;
  },

  methods: {
    fetchRootCSS(version) {
      return CSSProcessor
        .get(api.urls.cssComponents(version));
    },
    fetchThemes(version) {
      return api.getThemes(version).then((themes) => {
        this.themes = themes;
        return api.getThemeCSS(version, themes[0].theme.name);
      });
    },
    fetchComponentsIndex(version) {
      return api.getComponentsIndex(version);
    },
    updateAllContent(version) {
      Promise.all([
        this.fetchRootCSS(version),
        this.fetchThemes(version),
        this.fetchComponentsIndex(version),
      ])
        .then((result) => {
          this.version = version;
          [this.rootCSS, this.theme, this.fullComponentsIndex] = result;

          this.updateStyle()
            .then((css) => {
              this.cssComponents = ancss.parse(css, {
                detect: line => line.match(/^~/),
              });
            });
        });
    },
    updateOnlyTheme(name) {
      api.getThemeCSS(this.version, name)
        .then((theme) => {
          this.theme = theme;
          this.updateStyle();
        });
    },
    updateStyle() {
      return CSSProcessor
        .compile(this.preCSS)
        .then((css) => {
          this.style = css;
          return css;
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

  display: flex;
  overflow: hidden;
  position: static;
}

.app__side {
  min-width: 290px;
  max-width: 290px;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.app__main {
  margin-left: 290px;
  padding: 0 var(--content-padding);
  z-index: 8;
}

.app__content {
  margin: 10px 0 50vh;
}
</style>
