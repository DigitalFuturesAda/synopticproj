<template>
  <div class = "playlistScroller">
    <div class = "addingToPlaylist" v-if = "addingToPlaylist">
      test
    </div>
    <div class = "albumViewWrapper" v-else>
      <div class = "albumView" v-for = "audioFile in audioFiles">
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
          <add-svg/>
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

@Component({
  components: {
    AddSvg
  }
})
export default class PlaylistScroller extends Vue {
  @Prop() readonly audioFiles!: AudioFile[]

  private addingToPlaylist: boolean = true;

  public async mounted(): Promise<void> {

  }

  private getAlbumArt(audioFile: AudioFile){
    if (!audioFile.albumArt) return "";
    return Util.getImageFromBuffer(audioFile.albumArt);
  }
}
</script>

<style scoped lang="stylus">

  $background = #353b48
  $background_darken = darken($background, 20%)

  $albumSize = 90px;

  .playlistScroller
    display: flex
    flex-direction column

    .addingToPlaylist
      margin-left: 30px;
      margin-right: 30px;
      background: pink
      height: 100%

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
            fill: lighten($background, 40%)

        .information
          display: grid
          grid-template-columns auto auto
          grid-template-rows 1fr

          .wrapper
            display: flex
            flex-direction column;
            justify-content center

            h1
              color: white
              font-family Poppins;
              font-size: 16px
              font-weight: 400
              margin: 0

            h2
              color: white
              font-family Poppins;
              font-size: 16px
              font-weight: 400
              opacity: 0.75
              margin: 0

            h3
              color: white
              font-family Poppins;
              font-size: 16px
              font-weight: 400
              opacity: 0.65
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