import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const stateLike = {
  browserslist: [],
  cssComponents: [],
  customVars: {},
  fullComponentsIndex: '',
  loading: 0,
  rootCSS: '',
  selectedCategory: '',
  selectedPlatform: 'All',
  showCustomizer: false,
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
  getters: {
    categories(state) {
      return state.cssComponents
        .map(c => c.annotation.category)
        .sort()
        .filter((el, i, arr) => el !== arr[i - 1]);
    },
  },
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
