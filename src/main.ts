import Vue from 'vue'
import App from './ui/root/AppRoot.vue'
import router from './data/router'
import store from './data/store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
