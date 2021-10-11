import Vue from 'vue'
import Vuex from 'vuex'
import PlayerState from '@/data/store/modules/PlayerState';
import {MusicQueue} from '@/data/store/modules/MusicQueue';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    PlayerState,
    MusicQueue
  }
});

export default store