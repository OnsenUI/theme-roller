import Vue from 'vue';
import Portal from 'portal-vue';
import Modal from 'vue-js-modal';
import Popover from 'vue-js-popover';
import App from './App';
import store from './store';
import './styles/resources.css';
import './styles/global.css';

Vue.use(Portal);
Vue.use(Modal);
Vue.use(Popover);
Vue.config.productionTip = false;
Vue.prototype.$log = (...args) => console.log(...args); // eslint-disable-line no-console

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  beforeCreate() {
    const wl = window.location;
    if (wl.search.match(/customize/i)) {
      store.commit('showCustomizer', true);
      window.history
        .replaceState({}, document.title, `${wl.protocol}//${wl.host}${wl.pathname}${wl.hash}`);
    }
  },
  render: h => h(App),
});
