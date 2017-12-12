<template>
  <div class="app">
    <TRHeaderToolbar
      title="Theme Roller"
      @version="updateAllContent"
      @theme="updateOnlyTheme"
      @generator="$modal.show('generator')"
      @customizer="customizer = !customizer"
    />

    <div class="app__side-left">
      <TRFilter class="app__scrollable" />
    </div>

    <div class="app__main" :class="{ customizer }">
      <div class="app__content">
        <TRPreviewList class="app__scrollable" />
      </div>
    </div>

    <div class="app__side-right" v-show="customizer">
      <TRCustomizer class="app__scrollable" />
    </div>

    <modal name="generator">
      <div class="app__scrollable">
        <TRGenerator />
      </div>
    </modal>

    <portal-target name="picker" />
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import ancss from 'ancss';
import CSSProcessor from '@/css-processor';
import TRCustomizer from '@/components/TRCustomizer';
import TRFilter from '@/components/TRFilter';
import TRGenerator from '@/components/TRGenerator';
import TRHeaderToolbar from '@/components/TRHeaderToolbar';
import TRPreviewList from '@/components/TRPreviewList';
import api from '@/api';

export default {
  name: 'App',

  components: {
    TRCustomizer,
    TRHeaderToolbar,
    TRPreviewList,
    TRFilter,
    TRGenerator,
  },

  data() {
    return {
      styleElement: document.createElement('style'),
      customizer: false,
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

.app__title {
  position: fixed;
  margin: var(--content-padding);
}

.app__side-left {
  min-width: var(--left-side-width);
  max-width: var(--left-side-width);
  margin-top: var(--toolbar-height);
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.app__scrollable {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  height: calc(100% - 20vh);
  padding-bottom: 20vh;
}

.app__side-right {
  min-width: var(--right-side-width);
  max-width: var(--right-side-width);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: #fff;
}

.app__main {
  margin-left: var(--left-side-width);
  padding: 0 0 0 var(--content-padding);
  z-index: 8;

  &.customizer {
    margin-right: var(--right-side-width);
  }
}

.app__content {
  margin-top: var(--toolbar-height);
  height: calc(100vh - var(--toolbar-height));
}
</style>
