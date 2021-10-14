<template>
  <div class="searchView">

    <template v-if = "albumsLoaded">
      <div class = "topBar">
        <div class = "button">
          <input autofocus type="text" placeholder="Search term" v-model = "input">
        </div>
      </div>

      <div class = "playlistScrollerWrapper">
        <playlist-scroller :audio-files="searchForAudio(input)"></playlist-scroller>
      </div>
    </template>

    <template v-else>
      <div class = "fullscreenLoading">
        <h1>Loading... 🎸</h1>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {AlbumSingleton} from '../../core/audio/AlbumSingleton';
  import {albumMap} from '../../types/AlbumMap';
  import {Album} from '../../data/models/audio/Album';
  import PlaylistScroller from '../components/modules/player/PlaylistScroller.vue';
  import {AudioSearch} from '../../core/search/AudioSearch';

  let audioSearch = new AudioSearch();

  type storeCallback = (store: albumMap) => any;
  @Component({
    components: {PlaylistScroller}
  })
  export default class SearchView extends Vue {
    private albumsLoaded = false;
    private albumList: Array<Album> = new Array<Album>();

    private input: string = ""

    public async mounted(): Promise<void> {
      this.waitUntilStoreSet( store => {
        this.albumList = Object.values(store);
        this.albumsLoaded = true;
      })
    }

    private searchForAudio(audio: string){
      return audioSearch.searchForAudioFile(audio);
    }

    private waitUntilStoreSet(callback: storeCallback): unknown {
      let store = AlbumSingleton.getInstance().getStore();

      if (store === null || store === undefined){
        return setTimeout( () => this.waitUntilStoreSet(callback), 1000)
      }

      callback(store)
    }
  }
</script>

<style scoped lang="stylus">
@import "~@/ui/config.styl"

.searchView
  .fullscreenLoading
    display: flex
    align-items center
    justify-content center
    height: 100%

    h1
      color: $grey
      font-family Poppins;
      font-size: $bigFontSize

  .playlistScrollerWrapper
    margin-top: 30px

  .topBar
    padding-top: 30px
    margin-left: 30px;
    margin-right: 30px;

    .button
      display: flex
      align-items center
      justify-content center
      background: $darkWhite
      border-radius: 50px

      input
        outline: 0
        border: 0
        width: 100%
        height: 100%
        background: none
        color: $dark
        font-family Poppins;
        font-size: 20px
        font-weight: 400
        margin: 0
        padding: 15px

        &::placeholder
          color: $grey

      h1
        color: $grey
        font-family Poppins;
        font-size: $mediumFontSize
        font-weight: 400
        margin: 0
        padding: 15px
</style>