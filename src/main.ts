import Vue from 'vue'
import App from './ui/root/AppRoot.vue'
import router from './data/router'
import store from './data/store'
import './registerServiceWorker'
import VueSimpleAlert from "vue-simple-alert";

Vue.config.productionTip = false

Vue.use(VueSimpleAlert);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
