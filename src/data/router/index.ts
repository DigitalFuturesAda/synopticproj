import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import AlbumView from '@/ui/views/AlbumView.vue'
import PlaylistView from '@/ui/views/PlaylistView.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'AlbumView',
    component: AlbumView
  },
  {
    path: '/playlist/:id',
    name: 'PlaylistView',
    component: PlaylistView
  },
]

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
