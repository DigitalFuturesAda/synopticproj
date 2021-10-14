<template>
  <div class = "playlistScroller">
    <div class = "addingToPlaylist" v-if = "selectedAudioFile">
      <div class = "quickControls">
        <div class = "button" v-on:click = "selectedAudioFile = null">
          <x-svg></x-svg>
        </div>

        <div class = "button" v-on:click = "addToQueue(selectedAudioFile)">
          <h1>Add to Queue</h1>
        </div>

        <template v-if = "album && album.custom">
          <div class = "button" v-on:click = "removeFromPlaylist(album, selectedAudioFile)" style = "grid-column-start: 1; grid-column-end: 3">
            <h1>Remove from playlist</h1>
          </div>
        </template>
      </div>

      <div class = "playlistControls">
        <div class = "divider">
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

        <div class = "scroller">
          <div class = "primary-button" v-on:click = "createPlaylist(selectedAudioFile)">
            <h1>Create new</h1>
          </div>

          <div
              class = "button"
              v-for = "playlist in customPlaylists"
              v-on:click = "addToPlaylist(playlist, selectedAudioFile)"
          >
            <h1>{{ playlist.title }}</h1>
          </div>
        </div>
      </div>
    </div>
    <div class = "albumViewWrapper" v-else>
      <div class = "albumView" v-for = "audioFile in playlist">
        <div class = "albumCover">
          <img :src = "getAlbumArt(audioFile)" alt="icon"/>
        </div>
        <div class = "information">
          <div class = "wrapper">
            <h1>{{ audioFile.audioName }}</h1>
            <h2>{{ audioFile.album.title }}</h2>
            <h3>{{ audioFile.album.author }}</h3>
          </div>
        </div>
        <div class = "button">
          <add-svg v-on:click = "showOptions(audioFile)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'

import {Component, Prop, Vue} from 'vue-property-decorator';
import {AudioFile} from '@/data/models/audio/AudioFile';
import Util from '@/core/util/Util';

import AddSvg from "@/ui/assets/add.svg"
import {Album} from '@/data/models/audio/Album';
import {AlbumSingleton} from '@/core/audio/AlbumSingleton';
import {albumMap} from '@/types/AlbumMap';
import {namespace} from 'vuex-class';
import {PlaylistManager} from '@/core/playlist/PlaylistManager';

import LineSvg from "@/ui/assets/line.svg"
import XSvg from "@/ui/assets/x.svg"

const musicQueue = namespace('MusicQueue');

type storeCallback = (store: albumMap) => any;

@Component({
  components: {
    AddSvg, LineSvg, XSvg
  }
})
export default class PlaylistScroller extends Vue {
  /**
   * Refactor this so either an Album is passed which will always
   * be iterated through, and if custom will give the ability to
   * remove songs from playlists
   *
   * Still allow the audioFile's array to be passed.
   */
  @Prop() readonly audioFiles!: AudioFile[]
  @Prop() readonly album!: Album

  @musicQueue.Mutation addSong!: (state: AudioFile) => void;

  private customPlaylists: Array<Album> = new Array<Album>();
  private selectedAudioFile: AudioFile | null = null;

  public async mounted(): Promise<void> {
    this.waitUntilStoreSet(store => {
      this.customPlaylists = Object.values(store).filter(
          album => album.custom
      )
    })
  }

  get playlist(){
    return this.album ? this.album.audioFiles : this.audioFiles
  }

  private getAlbumArt(audioFile: AudioFile){
    if (!audioFile.albumArt) return "";
    return Util.getImageFromBuffer(audioFile.albumArt);
  }

  private showOptions(audioFile: AudioFile){
    this.$router.push("options")
    this.selectedAudioFile = audioFile
  }

  private addToQueue(audioFile: AudioFile){
    this.addSong(audioFile);
    this.selectedAudioFile = null
  }

  private createPlaylist(audioFile: AudioFile){
    this.$prompt("Enter playlist name").then(name => {
      try {
        PlaylistManager.getOrCreate().createPlaylist(name)
      } catch (error) {
        return this.$fire({
          type: 'error',
          title: 'Failed to add to create playlist',
          text: error,
        });
      }

      try {
        PlaylistManager.getOrCreate().addToPlaylist(name, audioFile.hash)
      } catch (error) {
        return this.$fire({
          type: 'error',
          title: 'Failed to add to playlist',
          text: error,
        });
      }

      this.$fire({
        type: 'success',
        title: "Added to playlist!",
        grow: "fullscreen",
        text: "To view the playlist the cache must be reloaded",
        confirmButtonText: "Reload cache"
      }).then( () => {
        location.reload()
      })
    });
  }

  private addToPlaylist(playlist: Album, audioFile: AudioFile){
    let addToPlaylistAttempt;

    try {
      addToPlaylistAttempt = PlaylistManager.getOrCreate().addToPlaylist(
          playlist.title,
          audioFile.hash
      );
    } catch (error) {
      return this.$fire({
        type: 'error',
        title: 'Failed to add to playlist',
        text: error,
      });
    }

    this.$fire({
      type: 'success',
      title: "Added to playlist!",
      grow: "fullscreen",
      text: "To view the playlist the cache must be reloaded",
      confirmButtonText: "Reload cache"
    }).then( () => {
      location.reload()
    })
  }

  private removeFromPlaylist(playlist: Album, audioFile: AudioFile){
    let removeFromPlaylistAttempt;

    try {
      removeFromPlaylistAttempt = PlaylistManager.getOrCreate().removeFromPlaylist(
          playlist.title,
          audioFile.hash
      );
    } catch (error) {
      return this.$fire({
        type: 'error',
        title: 'Failed to remove from playlist',
        text: error,
      });
    }

    this.$fire({
      type: 'success',
      title: "Removed from playlist!",
      grow: "fullscreen",
      text: "To view the playlist the cache must be reloaded",
      confirmButtonText: "Reload cache"
    }).then( () => {
      location.reload()
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

  @import "~@/ui/config.styl"

  $albumSize = 90px;

  .playlistScroller
    display: flex
    flex-direction column

    .addingToPlaylist
      margin-left: 30px;
      margin-right: 30px;
      height: 100%

      .playlistControls
        margin-top: 30px

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

        h1
          color: $orangePrimary;
          font-family: Poppins;
          font-size: $bigFontSize
          margin: 0;
          margin-bottom: 30px;

        .scroller
          .primary-button
            display: flex
            align-items center
            justify-content center
            background: -webkit-gradient(
                linear, 50% 0%, 50% 100%,
                color-stop(0%, $orangePrimary),
                color-stop(100%, $orangeSecondary));
            background-repeat: no-repeat;
            border-radius: 50px

            &:nth-child(n + 2)
              margin-top: 15px

            h1
              color: $white
              font-family Poppins;
              font-size: $mediumFontSize
              font-weight: 600
              margin: 0
              padding: 15px

          .button
            display: flex
            align-items center
            justify-content center
            background: $darkWhite
            border-radius: 50px

            &:nth-child(n + 2)
              margin-top: 15px

            h1
              color: $dark
              font-family Poppins;
              font-size: $mediumFontSize
              font-weight: 400
              margin: 0
              padding: 15px

      .quickControls
        width: 100%
        display: grid
        grid-template-columns auto auto
        grid-gap: 15px

        .button
          display: flex
          align-items center
          justify-content center
          background: -webkit-gradient(
              linear, 50% 0%, 50% 100%,
              color-stop(0%, $emeraldGreen),
              color-stop(100%, $lightSeaGreen));
          border-radius: 50px

          svg
            width: $bigFontSize + "5px"
            padding: 0
            margin: 0
            color: $white

          h1
            color: $white
            font-family Poppins;
            font-size: $mediumFontSize
            font-weight: 400
            margin: 0
            padding: 15px

    .albumViewWrapper
      margin-left: 30px;
      margin-right: 30px;

      .albumView
        width: 100%
        height: $albumSize
        display: grid
        grid-template-rows 1fr
        grid-template-columns $albumSize 1fr 50px
        grid-gap: 15px

        .button
          display flex
          align-items center
          justify-content center

          svg
            width: 24px
            fill: $darkWhiteSecondary

        .information
          display: grid
          grid-template-columns auto auto
          grid-template-rows 1fr

          .wrapper
            display: flex
            flex-direction column;
            justify-content center

            h1
              color: $dark
              font-family Poppins;
              font-size: $smallFontSize
              font-weight: 400
              margin: 0

            h2
              color: $darkSecondary
              font-family Poppins;
              font-size: $smallFontSize
              font-weight: 400
              margin: 0

            h3
              color: $darkSecondary
              font-family Poppins;
              font-size: $smallFontSize
              font-weight: 600
              opacity: 0.75
              margin: 0

        .albumCover
          width: $albumSize
          height: $albumSize

          img
            object-fit cover
            width: $albumSize
            height: $albumSize
            border-radius: 50%

        &:nth-child(n + 2)
          margin-top: 30px

        &:last-child
          margin-bottom: 30px
</style>