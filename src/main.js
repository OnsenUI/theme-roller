import Vue from 'vue';
import Portal from 'portal-vue';
import Modal from 'vue-js-modal';
import Popover from 'vue-js-popover';
import VueI18n from 'vue-i18n';
import App from './App';
import store from './store';
import './styles/resources.css';
import './styles/global.css';

Vue.use(Portal);
Vue.use(Modal);
Vue.use(Popover);
Vue.use(VueI18n);
Vue.config.productionTip = false;
Vue.prototype.$log = (...args) => console.log(...args); // eslint-disable-line no-console

const qs = window.location.search.substring(1).split('&')
  .reduce((acc, v) => ({
    ...acc,
    [v.split('=')[0]]: v.split('=')[1],
  }), {});

const hostPrefix = ((window.location.hostname.split('.')[0] === 'ja') ? 'ja' : null);

const i18n = new VueI18n({
  locale: qs.lang || hostPrefix || 'en',
  fallbackLocale: 'en',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  i18n,
  beforeCreate() {
    const wl = window.location;
    if ('customize' in qs || 'customizer' in qs) {
      store.commit('showCustomizer', true);
      window.history
        .replaceState({}, document.title, `${wl.protocol}//${wl.host}${wl.pathname}${wl.hash}`);
    }
  },
  render: h => h(App),
});
