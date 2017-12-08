import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const stateLike = {
  browserslist: [],
  cssComponents: [],
  fullComponentsIndex: '',
  rootCSS: '',
  theme: '',
  themes: [],
  version: '',
  versions: [],
};

const createMutations = () =>
  Object.keys(stateLike)
    .reduce((mutations, key) => ({
      ...mutations,
      [key](state, payload) {
        state[key] = payload;
      },
    }), { });

const store = new Vuex.Store({
  state: { ...stateLike },
  mutations: createMutations(),
});

export const mapMutationState = states =>
  states.reduce((computed, key) => ({
    ...computed,
    [key]: {
      get() {
        return store.state[key];
      },
      set(value) {
        store.commit(key, value);
      },
    },
  }), { });

export default store;
