import Vue from 'vue';
import Portal from 'portal-vue';
import Modal from 'vue-js-modal';
import Popover from 'vue-js-popover';
import App from './App';
import store from './store';
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
  render: h => h(App),
});
