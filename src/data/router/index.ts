import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import AlbumView from '@/ui/views/home/AlbumView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'AlbumView',
    component: AlbumView
  }
]

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
