<template>
  <div class="homePage">
    <div class = "albumWrapper">
      <h1>• Albums</h1>
      <div class = "scrollerView">
        <div class = "album" v-for="album of albumList">
          <div class = "albumCover">
            <img alt = "albumCover" :src = "getImageFromBuffer(album.albumCover)"/>
          </div>
          <div class = "albumName">
            <h1>{{ album.title }}</h1>
          </div>
        </div>
      </div>

      <h1>• Playlists</h1>
      <div class = "scrollerView">
        <div class = "album" v-for="album of playList">
          <div class = "albumCover">
            <img alt = "albumCover" :src = "getImageFromBuffer(album.albumCover)"/>
          </div>
          <div class = "albumName">
            <h1>{{ album.title }}</h1>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import AudioController from '@/ui/components/modules/player/AudioController.vue';
  import {Album} from '@/data/models/audio/Album';
  import {AlbumSingleton} from '@/core/audio/AlbumSingleton';
  import {albumMap} from '@/types/AlbumMap';

  type storeCallback = (store: albumMap) => any;

  @Component({
    components: {
      AudioController,
    },
  })
  export default class Home extends Vue {
    private albumList: Array<Album> = new Array<Album>();
    private playList: Array<Album> = new Array<Album>();

    public async mounted(): Promise<void> {
      this.waitUntilStoreSet( store => {
        this.albumList = Object.values(store).filter(album => !album.custom);
        this.playList = Object.values(store).filter(album => album.custom);

        for (let album of this.albumList){
          console.log(album.hashcode)
        }
      })
    }

    public getImageFromBuffer(buffer: Uint8Array){
      return URL.createObjectURL(new Blob([buffer], { type: 'image/png' }));
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
  .homePage
    height: 100%
    width: 100%
    max-height 100%

    .albumWrapper
      padding-top: 30px
      margin-left: 30px;
      margin-right: 30px;
      display: grid
      height: 100%
      grid-template-columns 1fr
      grid-template-rows auto 1fr auto auto
      grid-gap: 0

      h1
        color: white
        font-family Poppins;
        font-size: 25px
        margin: 0
        margin-bottom: 10px

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
              font-family Poppins;
              font-weight: 500
              font-size: 15px
              margin: 0
              margin-top: 5px
              text-overflow: ellipsis
              overflow hidden

          .albumCover
            background: white
            width: 180px
            height: 180px

            img
              width: 180px
              height: 180px
              object-fit cover

</style>
