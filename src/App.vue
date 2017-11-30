<template>
  <div id="app">
    <PreviewList :components="components" />
  </div>
</template>

<script>
import ancss from 'ancss';
import axios from 'axios';
import PreviewList from '@/components/PreviewList';

export default {
  name: 'App',
  components: {
    PreviewList,
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
  },
  mounted() {
    axios
      .get('https://unpkg.com/onsenui@2.8.2/css/onsen-css-components.css')
      .then((response) => {
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
