import Vue from 'vue';
import Popover from 'vue-js-popover';
import App from './App';
import store from './store';
import router from './router';
import './styles/global.css';

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
