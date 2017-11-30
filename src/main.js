import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import './styles/global.css';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
