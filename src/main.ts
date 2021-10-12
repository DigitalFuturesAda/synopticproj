import Vue from 'vue'
import App from './ui/root/AppRoot.vue'
import router from './data/router'
import store from './data/store'
import XnsSeekBar from 'xns-seek-bar'

Vue.use(XnsSeekBar)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
