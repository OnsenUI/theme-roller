<template>
  <div class="tr-app">

    <div class="tr-app__side-left">
      <TRMenu
        class="tr-app__scrollable"
        @version="updateAllContent"
        @theme="updateOnlyTheme"
      />
    </div>

    <div class="tr-app__main" :class="{ customizer: showCustomizer }">
      <div class="tr-app__content">
        <TRPreviewList
          ref="main"
          class="tr-app__scrollable"
        />
      </div>
    </div>

    <div class="tr-app__side-right" v-show="showCustomizer">
      <TRCustomizer
        xclass="tr-app__scrollable"
        @variable="updateStyle"
        @generator="$modal.show('generator')"
      />
    </div>

    <modal
      name="generator"
      height="auto"
      width="500px"
    >
      <div class="tr-app__generator">
        <TRCloseButton @click="$modal.hide('generator')" />
        <TRGenerator xclass="tr-app__scrollable" />
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
import TRMenu from '@/components/TRMenu';
import TRGenerator from '@/components/TRGenerator';
import TRCloseButton from '@/components/TRCloseButton';
import TRPreviewList from '@/components/TRPreviewList';
import api from '@/api';

export default {
  name: 'App',

  components: {
    TRCloseButton,
    TRCustomizer,
    TRPreviewList,
    TRMenu,
    TRGenerator,
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
      'fullComponentsIndex',
      'rootCSS',
      'showCustomizer',
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

  created() {
    this.styleElement.id = 'onsen-css-components';
    this.styleElement.type = 'text/css';
    document.head.insertBefore(this.styleElement, document.head.querySelector('style'));

    Promise.all([api.getVersions(), api.getBrowserslist()])
      .then(([versions, browserslist]) => {
        this.versions = versions;
        this.browserslist = browserslist;
        return this.updateAllContent(versions[0]);
      })
      .then(() => this.$refs.main.onScroll());
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
      return Promise.all([
        this.fetchRootCSS(version),
        this.fetchThemes(version),
        this.fetchComponentsIndex(version),
      ])
        .then((result) => {
          this.version = version;
          [this.rootCSS, this.theme, this.fullComponentsIndex] = result;

          return this.updateStyle()
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
.tr-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  display: flex;
  overflow: hidden;
  position: static;
}

.tr-app__title {
  position: fixed;
  margin: var(--content-padding);
}

.tr-app__side-left {
  min-width: var(--left-side-width);
  max-width: var(--left-side-width);
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 8;
}

.tr-app__side-right {
  min-width: var(--right-side-width);
  max-width: var(--right-side-width);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: var(--background-color);
}

.tr-app__main {
  margin-left: calc(var(--left-side-width) - 20px);
  background-color: var(--background-color);
  z-index: 10;

  &.customizer {
    margin-right: var(--right-side-width);
  }
}

.tr-app__content {
  height: 100vh;
}

.tr-app__generator {
  height: 100%;
  padding-top: var(--content-padding);
}
</style>

<style>
.tr-app__scrollable {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  height: calc(100% - 20vh);
  padding-bottom: 20vh;
}
</style>
