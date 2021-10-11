import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/ui/views/home/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})