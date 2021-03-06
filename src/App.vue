<template>
  <div class="tr-app">
    <div
      class="tr-app__mask"
      :class="{ hidden: !menuOpen }"
      @click="menuOpen = false"
    />

    <div class="tr-app__side-left" :class="{ open: menuOpen }">
      <a @click="menuOpen = !menuOpen" class="tr-app__side-left__menu-button" />
      <TRMenu
        class="scrollable tr-app__offset-top"
        @version="updateAllContent"
        @theme="updateOnlyTheme"
      />
    </div>

    <div class="tr-app__main" :class="{ customizer: showCustomizer }">
      <div class="tr-app__content">
        <TRPreviewList
          ref="main"
          class="scrollable tr-app__offset-top"
        />
        <a class="tr-app__content--gotop" @click="$refs.main.$el.scrollTop = 0">
          <span />
        </a>
      </div>
    </div>

    <div class="tr-app__side-right" v-show="showCustomizer">
      <TRCustomizer
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
        <TRGenerator />
      </div>
    </modal>

    <portal-target name="picker" />
  </div>
</template>

<script>
import { mapMutationState } from '@/store';
import ancss from '@onsenui/ancss';
import CSSProcessor from '@/css-processor';
import TRCustomizer from '@/components/TRCustomizer';
import TRMenu from '@/components/TRMenu';
import TRGenerator from '@/components/TRGenerator';
import TRCloseButton from '@/components/TRCloseButton';
import TRPreviewList from '@/components/TRPreviewList';
import api from '@/api';
import cache from '@/api/cache';
import extraExamples from '@/extra-examples/extra-examples.json';

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
      menuOpen: false,
    };
  },

  computed: {
    ...mapMutationState([
      'browserslist',
      'cssComponents',
      'loading',
      'extraExamples',
      'fullComponentsIndex',
      'rootCSS',
      'showCustomizer',
      'theme',
      'themes',
      'version',
      'versionIndex',
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
        this.versionIndex = cache.has('selected-version')
          ? versions.length - Number(cache.get('selected-version'))
          : 0;

        return this.updateAllContent(versions[this.versionIndex]);
      })
      .then(() => {
        if (window.location.hash) {
          const tmp = window.location.hash;
          window.location.hash = '';
          window.location.hash = tmp;
        }

        this.$refs.main.onScroll();
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
        return api
          .getThemeCSS(version, themes[Number(cache.get('selected-theme')) || 0].theme.name);
      });
    },
    fetchComponentsIndex(version) {
      return api.getComponentsIndex(version);
    },
    updateAllContent(version) {
      // Extra css component examples that aren't pulled from OnsenUI repo.
      // Examples are added here if we release a new version of OnsenUI and
      // forget to add new examples to the CSS.
      this.extraExamples = extraExamples.filter(e => e.versions.includes(version));

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
    updateStyle(callback) {
      return CSSProcessor
        .compile(this.preCSS)
        .then((css) => {
          this.style = css;
          this.loading = false;
          if (callback instanceof Function) {
            callback();
          }
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

.tr-app__mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  transition: opacity 0.2s ease;
  background-color: #000;
  opacity: 0.2;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.tr-app__offset-top {
  padding-top: var(--top-offset);
}

.tr-app__side-left {
  min-width: var(--left-side-width);
  max-width: var(--left-side-width);
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 8;
  background-color: var(--background-color);
  transition: transform .2s ease;

  & .tr-app__side-left__menu-button {
    width: 15px;
    height: 60px;
    position: absolute;
    top: 5px;
    right: -15px;
    background-color: var(--primary);
    display: none;
  }

  @media (--mobile) {
    z-index: 3000;
    transform: translate3d(-100%, 0, 0);

    & .tr-app__side-left__menu-button {
      display: block;
    }

    &.open {
      transform: translate3d(0, 0, 0);
    }
  }
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

  @media (--smallscreen) {
    display: none;
  }
}

.tr-app__main {
  margin-left: var(--left-side-width);
  background-color: var(--background-color);
  z-index: 10;

  &.customizer {
    margin-right: var(--right-side-width);
  }


  @media (--mobile) {
    margin-left: 0;
    margin-right: 0;
  }
}

.tr-app__content {
  height: 100vh;
  position: relative;

  & .tr-app__content--gotop {
    background-color: #fff;
    color: var(--primary);
    position: absolute;
    bottom: 16px;
    right: 24px;
    opacity: .6;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    & span {
      width: 16px;
      height: 16px;
      display: block;
      border-top: 4px solid var(--primary);
      border-right: 4px solid var(--primary);
      transform: rotate(-45deg) translate3d(-4px, 4px, 0);
    }
  }
}

.tr-app__generator {
  height: 100%;
  padding-top: var(--content-padding);
}
</style>
