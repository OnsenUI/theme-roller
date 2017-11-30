import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    components: [],
    versions: [],
  },
  mutations: {
    setComponents(state, payload) {
      state.components = payload;
    },
    setVersions(state, payload) {
      state.versions = payload;
    },
  },
});
