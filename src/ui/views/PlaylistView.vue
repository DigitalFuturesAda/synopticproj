<template>
  <div class = "playlistView">
    <div class = "playlistViewWrapper">
      <template v-if = "hasFetchedAlbum">
        <div class = "title">
          <div class = "information">
            <h1>{{ fetchedAlbum.title }}</h1>
            <h2>{{ fetchedAlbum.author }}</h2>
          </div>
          <div class = "controls" v-if="fetchedAlbum.custom">
            <div class = "button" v-on:click = "deletePlaylist()">
              <h1>Delete</h1>
            </div>
          </div>
        </div>

        <div class = "playlistContents">
          <playlist-scroller
              :album = "fetchedAlbum">
          </playlist-scroller>
        </div>
      </template>

      <template v-else>
        <div class = "message">
          <template v-if = "!hasFetchedAlbum">
            <h1>Loading... 🎸</h1>
          </template>
          <template v-else-if = "failedToFetchAlbum">
            <h1>Failed to load album</h1>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {AlbumSingleton} from '@/core/audio/AlbumSingleton';
  import {albumMap} from '@/types/AlbumMap';
  import {Album} from '@/data/models/audio/Album';
  import PlaylistScroller from '@/ui/components/modules/player/PlaylistScroller.vue';
  import {PlaylistManager} from '../../core/playlist/PlaylistManager';

  type storeCallback = (store: albumMap) => any;

  @Component({
    components: {
      PlaylistScroller
    }
  })
  export default class PlaylistView extends Vue {
    private hasFetchedAlbum: boolean = false;
    private failedToFetchAlbum: boolean = true;
    private fetchedAlbum!: Album;

    public async mounted(): Promise<void> {
      const playlistId = this.$route.params.id;
      if (playlistId === "queue") return; // This requires special handling

      this.waitUntilStoreSet(store => {
        const matchingAlbum = Object.values(store)
            .filter(store => store.hashcode === Number.parseInt(playlistId))[0]

        if (!matchingAlbum){
          this.$router.push("/")
          this.failedToFetchAlbum = true;
          return;
        }

        this.hasFetchedAlbum = true;
        this.fetchedAlbum = matchingAlbum;
      })
    }

    private deletePlaylist(){
      try {
        PlaylistManager.getOrCreate().deletePlaylist(this.fetchedAlbum.title);
      } catch (error) {
        return this.$fire({
          type: 'error',
          title: 'Failed to delete playlist',
          text: error,
        });
      }

      this.$fire({
        type: 'success',
        title: "Deleted playlist!",
        grow: "fullscreen",
        text: "Press reload cache to go to the home page",
        confirmButtonText: "Reload cache"
      }).then( () => {
        window.location.replace("/")
      })
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
  $background = #353b48
  $secondary = lighten($background, 20%)
  $background_darken = darken($background, 20%)

  .playlistView
    height: 100%
    width: 100%
    max-height 100%

    .playlistViewWrapper
      height: 100%

      .message
        display: flex
        justify-content center
        align-items center
        height: 100%

        h1
          color: white
          font-family Poppins;
          font-size: 25px
          font-weight: 400
          margin: 0

      .title
        margin-left: 30px;
        margin-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px
        display: grid
        grid-template-rows 1fr
        grid-template-columns 1fr auto

        .controls
          .button
            display: flex
            align-items center
            justify-content center
            background: $background
            border-radius: 50px

            h1
              color: white
              font-family Poppins;
              font-size: 20px
              font-weight: 400
              margin: 0
              padding: 15px
              padding-left: 30px
              padding-right: 30px

        .information
          h2
            color: white
            font-family Poppins;
            font-size: 20px
            font-weight: 500
            margin: 0
            opacity: 0.75

          h1
            color: white
            font-family Poppins;
            font-size: 25px
            font-weight: 400
            margin: 0
</style>