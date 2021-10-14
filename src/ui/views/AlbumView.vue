<template>
  <div class="homePage">
    <div class = "topBar" v-if = "albumsLoaded">
      <div class = "button" v-on:click = "openSearch()">
        <h1>Search</h1>
      </div>
    </div>
    <div class = "albumWrapper" v-if = "albumsLoaded">
      <div class = "divider">
        <div class = "wrapper">
          <line-svg></line-svg>
        </div>

        <div class = "wrapper">
          <h1>Albums</h1>
        </div>

        <div class = "wrapper">
          <line-svg></line-svg>
        </div>
      </div>
      <div class = "scrollerView">
        <div class = "album" v-for="album of albumList" @click = "loadAlbum(album.hashcode)">
          <div class = "albumCover">
            <img alt = "albumCover" :src = "getImageFromBuffer(album.albumCover)"/>
          </div>
          <div class = "albumName">
            <h1>{{ album.title }}</h1>
          </div>
        </div>
      </div>

      <div class = "divider playlist-divider">
        <div class = "wrapper">
          <line-svg></line-svg>
        </div>

        <div class = "wrapper">
          <h1>Playlists</h1>
        </div>

        <div class = "wrapper">
          <line-svg></line-svg>
        </div>
      </div>
      <div v-if = "playList.length > 0" class = "scrollerView">
        <div class = "album" v-for="album of playList" @click = "loadAlbum(album.hashcode)">
          <div class = "albumCover">
            <img alt = "albumCover" :src = "getImageFromBuffer(album.albumCover)"/>
          </div>
          <div class = "albumName">
            <h1>{{ album.title }}</h1>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class = "fullscreenLoading">
        <h1>Loading... 🎸</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import AudioController from '../components/modules/player/AudioController.vue';
  import {Album} from '../../data/models/audio/Album';
  import {AlbumSingleton} from '../../core/audio/AlbumSingleton';
  import {albumMap} from '../../types/AlbumMap';
  import Util from "../../core/util/Util"
  import LineSvg from "@/ui/assets/line.svg"

  type storeCallback = (store: albumMap) => any;

  @Component({
    components: {
      AudioController, LineSvg
    },
  })
  export default class AlbumView extends Vue {
    private albumList: Array<Album> = new Array<Album>();
    private playList: Array<Album> = new Array<Album>();

    private albumsLoaded = false;

    public async mounted(): Promise<void> {
      this.waitUntilStoreSet( store => {
        this.albumList = Object.values(store).filter(album => !album.custom);
        this.playList = Object.values(store).filter(album => album.custom);
        this.albumsLoaded = true;
      })
    }

    private getImageFromBuffer(buffer: Uint8Array){
      return Util.getImageFromBuffer(buffer);
    }

    private loadAlbum(hashcode: number){
      this.$router.push({ path: `playlist/${hashcode}` })
    }

    private openSearch(){
      this.$router.push({ path: '/search' })
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

  .homePage
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

        h1
          color: $grey
          font-family Poppins;
          font-size: 20px
          font-weight: 400
          margin: 0
          padding: 15px

    .fullscreenLoading
      display: flex
      align-items center
      justify-content center
      height: 100%

      h1
        color: $grey
        font-family Poppins;
        font-size: 25px

    .albumWrapper
      padding-top: 30px
      margin-left: 30px;
      margin-right: 30px;
      display: grid
      height: 100%
      grid-template-columns 1fr
      grid-template-rows auto 1fr auto auto
      grid-gap: 0

      .divider
        display: grid
        grid-template-columns 1fr auto 1fr
        grid-gap: 15px
        margin-bottom: 15px

        .wrapper
          display flex
          justify-content center
          align-items center

          svg
            transform: translateY(-5px)

          h1
            color: $orangePrimary
            font-family Poppins;
            font-size: $bigFontSize
            margin: 0
            margin-bottom: 10px

      .playlist-divider
        .wrapper
          svg
            path
              stroke: $lightSeaGreen

          h1
            color: $lightSeaGreen

      .scrollerView
        display: grid;
        grid-template-rows: auto auto;
        grid-auto-flow: column;
        overflow-x: scroll;
        overflow-y: hidden
        grid-gap: 20px
        margin: 0
        height: min-content;
        padding-bottom: 30px
        overscroll-behavior-x: contain;

        &::-webkit-scrollbar
          display: none;

        .album
          width: 180px
          height: 220px
          margin: 0

          .albumName
            height: 40px
            display: flex
            align-items center

            h1
              color: $grey
              font-family Poppins;
              font-weight: 500
              font-size: $smallFontSize
              margin: 0
              margin-top: 5px
              text-overflow: ellipsis
              overflow hidden

          .albumCover
            background: white
            width: 180px
            height: 180px

            img
              border-radius: 5px
              width: 180px
              height: 180px
              object-fit cover
</style>
