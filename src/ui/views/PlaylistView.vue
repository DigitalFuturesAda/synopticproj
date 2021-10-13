<template>
  <div class = "playlistView">
    <div class = "playlistViewWrapper">
      <template v-if = "hasFetchedAlbum">
        <div class = "title">
          <h1>{{ fetchedAlbum.title }}</h1>
          <h2>{{ fetchedAlbum.author }}</h2>
        </div>

        <div class = "playlistContents">
          <playlist-scroller
              :audioFiles = "fetchedAlbum.audioFiles">
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
      <!--
        This component should only contain the Album name, artist,
        the rest should be abstracted away into a PlaylistComponent
        which takes an array of AudioFile's

        The PlaylistComponent should display the:
          - Album art
          - Song name
          - Icon to add to queue (this should be hidden if queue === true)
          - Icon to add to playlist
      -->
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {AlbumSingleton} from '@/core/audio/AlbumSingleton';
  import {albumMap} from '@/types/AlbumMap';
  import {Album} from '@/data/models/audio/Album';
  import PlaylistScroller from '@/ui/components/modules/player/PlaylistScroller.vue';

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
          console.log("Couldn't find matching album");
          this.failedToFetchAlbum = true;
          return;
        }

        this.hasFetchedAlbum = true;
        this.fetchedAlbum = matchingAlbum;
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

      .playlistContents
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