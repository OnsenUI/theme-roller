<template>
  <div class="app">
    <TRHeaderToolbar />
    <div class="app__content">
      <TRPreviewList :components="annotations" />
    </div>
  </div>
</template>

<script>
import ancss from 'ancss';
import { mapState, mapMutations } from 'vuex';
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
    };
  },

  computed: {
    ...mapState(['components', 'versions']),
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
  },

  created() {
    this.styleElement.type = 'text/css';
    document.head.insertBefore(this.styleElement, document.querySelector('style'));

    api.getCSS().then((css) => {
      this.style = css;
      this.setComponents(ancss.parse(css, { detect: line => line.match(/^~/) }));
    });

    api.getVersions().then((versions) => {
      this.setVersions(versions);
    });
  },

  methods: {
    ...mapMutations(['setComponents', 'setVersions']),
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
