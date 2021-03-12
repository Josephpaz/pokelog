import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Pagination from 'vue-pagination-2';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";


Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Pagination);
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
