import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    components: [],
    versions: [],
    themes: [],
  },
  mutations: {
    setComponents(state, payload) {
      state.components = payload;
    },
    setVersions(state, payload) {
      state.versions = payload;
    },
    setThemes(state, payload) {
      state.themes = payload;
    },
  },
});
