import Vue from 'vue';
import Modal from 'vue-js-modal';
import Popover from 'vue-js-popover';
import App from './App';
import store from './store';
import router from './router';
import './styles/global.css';

Vue.use(Modal);
Vue.use(Popover);
Vue.config.productionTip = false;
Vue.prototype.$log = (...args) => console.log(...args); // eslint-disable-line no-console

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
