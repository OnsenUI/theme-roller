<template>
  <div id="app">
    <div class="content">
      <TRPreviewList :components="components" />
    </div>
  </div>
</template>

<script>
import ancss from 'ancss';
import axios from 'axios';
import TRPreviewList from '@/components/TRPreviewList';

export default {
  name: 'App',
  components: {
    TRPreviewList,
  },
  data() {
    return {
      styleElement: document.createElement('style'),
    };
  },
  computed: {
    components: {
      get() {
        return this.$store.state.components.map(c => c.annotation);
      },
      set(value) {
        this.$store.commit('setComponents', value);
      },
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

    axios
      .get('https://unpkg.com/onsenui@2.8.2/css/onsen-css-components.css')
      .then((response) => {
        this.style = response.data;
        const components = ancss.parse(response.data, { detect: line => line.match(/^~/) });
        this.components = components;
      });
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.content {
  padding: 20px;
  margin: 10px 0 50vh;
}
</style>
