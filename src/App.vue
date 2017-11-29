<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
import ancss from 'ancss';
import axios from 'axios';

export default {
  name: 'App',
  mounted() {
    axios
      .get('https://unpkg.com/onsenui@2.8.2/css/onsen-css-components.css')
      .then((response) => {
        const components = ancss.parse(response.data, { detect: line => line.match(/^~/) });
        console.log(components);
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
