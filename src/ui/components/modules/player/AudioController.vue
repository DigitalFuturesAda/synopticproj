<template>
  <div>
    <audio ref="audioInstance" autoplay :controls="debugOption_displayAudioElement" :src = "computedCurrentSong"></audio>
    <div class = "audioController">
      <div class = "audioWrapper">

        <div class = "audioInformation" v-if = "currentSong">
          <div class = "audioCover">
            <img :src="albumArt" alt="Album cover">
          </div>
          <div class = "artistInformation">
            <h1>{{ currentSong.audioName }}</h1>
            <h2>{{ currentSong.album.author }}</h2>
          </div>
        </div>

        <div class = "audioSeeker" v-show = "currentSong">
          <div class = "musicProgress">
            <input
                ref="audioProgress"
                :style = "{ backgroundSize: `${audioProgressPercent}%` }"
                type="range"
                :value="audioProgressPercent"
                min="0"
                step="any"
                max="100">
          </div>

          <div class = "labels" v-if = "currentSong">
            <div class = "currentTime">
              <h1>{{ currentAudioDuration }}</h1>
            </div>
            <div class = "audioDuration">
              <h1>{{ maximumAudioDuration }}</h1>
            </div>
          </div>
        </div>

        <div class = "audioControls">
          <div class = "wrapper">
            <ImageButton
                v-on:click.native="currentSong && shufflePlaylist()"
                style = "transform: scale(0.6)"
                :disabled="!currentSong">
              <ShuffleSvg fill = "white" style = "opacity: 0.3"/>
            </ImageButton>

            <ImageButton
                v-on:click.native="(currentSong && !isAudioQueueFirstItem) && previousSong()"
                :disabled="!currentSong || isAudioQueueFirstItem"
                style = "transform: scale(1.1)">
              <RewindSvg fill = "white" style = "opacity: 0.75"/>
            </ImageButton>

            <ImageButton
                v-on:click.native="currentSong && playPauseButtonPress()"
                :disabled="!currentSong"
                style = "transform: scale(1.5); padding-left: 15px; padding-right: 15px">
              <template v-if="isPaused">
                <PlaySvg fill = "white" style = "opacity: 0.95"/>
              </template>
              <template v-else>
                <PauseSvg fill = "white" style = "opacity: 0.95"/>
              </template>
            </ImageButton>

            <ImageButton
                v-on:click.native="(currentSong && !isAudioQueueLastItem) && nextSong()"
                :disabled="!currentSong || isAudioQueueLastItem"
                style = "transform: scale(1.1)">
              <FastForwardSvg fill = "white" style = "opacity: 0.75"/>
            </ImageButton>

            <ImageButton style = "transform: scale(0.6)" :disabled="!currentSong" v-on:click.native="openPlaylistQueue()">
              <CollectionSvg fill = "white" style = "opacity: 0.3"/>
            </ImageButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { AudioTransformer } from "@/core/audio/AudioTransformer";
import { AlbumSingleton } from "@/core/audio/AlbumSingleton";
import { namespace } from 'vuex-class';
import { AudioFile } from '@/data/models/audio/AudioFile';
import PlayerState from '@/data/store/modules/PlayerState';
import Util from "@/core/util/Util"
import ImageButton from "@/ui/components/base/button/ImageButton.vue";

import ShuffleSvg from "@/ui/assets/shuffle.svg";
import RewindSvg from "@/ui/assets/rewind.svg";
import PauseSvg from "@/ui/assets/pause.svg";
import PlaySvg from "@/ui/assets/play.svg";
import FastForwardSvg from "@/ui/assets/fast-forward.svg";
import CollectionSvg from "@/ui/assets/collection.svg";

const playerState = namespace('PlayerState');
const musicQueue = namespace('MusicQueue');
@Component({
  components: {
    ImageButton, ShuffleSvg, RewindSvg, PauseSvg, FastForwardSvg, CollectionSvg,
    PlaySvg
  }
})
export default class AudioController extends Vue {
  private readonly debugOption_displayAudioElement = false;

  @musicQueue.Mutation addSong!: (state: AudioFile) => void;
  @musicQueue.Mutation nextSong!: () => void;
  @musicQueue.Mutation previousSong!: () => void;
  @musicQueue.Mutation shufflePlaylist!: () => void;
  @musicQueue.Getter currentTrackNumber!: number;
  @musicQueue.Getter playlistLength!: number;
  @musicQueue.Getter currentSong!: AudioFile;

  @playerState.Mutation setAudioProgress!: (state: number) => void;
  @playerState.Mutation setPausedState!: (state: boolean) => void;
  @playerState.Getter audioProgressPercent!: number;
  @playerState.Getter isPaused!: boolean;

  @Ref('audioInstance') audioInstance!: HTMLAudioElement;
  @Ref('audioProgress') audioProgress!: HTMLInputElement;

  currentAudioDuration: string = "0:00";
  maximumAudioDuration: string = "0:00";

  get computedCurrentSong(){
    if (this.currentSong){
      return this.currentSong.audioFileLocation;
    }
    return "";
  }

  get isAudioQueueLastItem(){
    return this.currentTrackNumber === this.playlistLength - 1;
  }

  get isAudioQueueFirstItem(){
    return this.currentTrackNumber === 0;
  }

  get albumArt(){
    if (!this.currentSong.albumArt) return
    return Util.getImageFromBuffer(this.currentSong.albumArt)
  }

  public playPauseButtonPress() {
    if (this.isPaused){
      this.audioInstance.play();
    } else {
      this.audioInstance.pause();
    }
  }

  private openPlaylistQueue(){
    this.$router.push({ path: `playlist/queue` })
  }

  public async mounted(): Promise<void> {
    new AudioTransformer().createAlbumMemoryCache().then(parsedResponse => {
      AlbumSingleton.getInstance().setStore(parsedResponse);

      let audioFile = AlbumSingleton.getInstance().getStore()["Black Holes and Revelations"].audioFiles;

      setTimeout( () => {
        this.addSong(audioFile[3])
        this.addSong(audioFile[4])
        this.addSong(audioFile[5])
        this.addSong(audioFile[6])
      }, 0)

    });

    this.audioInstance.ontimeupdate = () => {
      this.setAudioProgress((this.audioInstance.currentTime / this.audioInstance.duration) * 100)
      this.currentAudioDuration = Util.formatSeconds(this.audioInstance.currentTime);
    }

    this.audioInstance.onended = () => {
      this.nextSong()
    }

    this.audioInstance.addEventListener('canplaythrough', () => {
      this.maximumAudioDuration = Util.formatSeconds(this.audioInstance.duration);
    }, false);

    this.audioInstance.onpause = () => {
      this.setPausedState(true);
    }

    this.audioInstance.onplay = () => {
      this.setPausedState(false);
    }

    this.audioProgress.oninput = () => {
      this.audioInstance.currentTime = Number.parseInt(this.audioProgress.value) / 100 * this.audioInstance.duration;
    }
  }
}
</script>

<style scoped lang="stylus">
  $bandInformationHeight = 70px
  $background = #353b48
  $secondary = lighten($background, 20%)

  .audioController
    width 100vw
    background $background

    .audioWrapper
      padding-top: 30px
      margin-left: 30px
      margin-right: @margin-left

      .audioInformation
        height: $bandInformationHeight
        display: grid
        grid-template-columns: $bandInformationHeight 1fr
        grid-gap: 20px
        margin-bottom: 25px

        .artistInformation
          display: flex
          flex-direction: column
          align-items flex-start
          justify-content center

          h1
            font-family: 'Poppins', sans-serif;
            font-size: 18px
            text-align start
            color: white
            text-shadow: 0 0 13px $secondary
            margin: 0

          h2
            font-family: 'Poppins', sans-serif;
            font-size: 18px
            color: white
            opacity: 0.65
            margin: 0

        .audioCover
          width: $bandInformationHeight
          height: $bandInformationHeight

          img
            width: 100%
            border-radius 50%
            height: 100%
            filter: brightness(1.25)
            object-fit: cover

      .audioControls
        display: flex
        justify-content: center
        align-items center
        padding-bottom: 30px

        .wrapper
          display: flex
          align-items: stretch;
          justify-content: space-around

          .playPauseButton
            width: 35px;
            height: 35px

      .audioSeeker
        padding-bottom: 10px

        .labels
          display: flex

          .currentTime
            margin-left: 2px

            h1
              font-weight bold
              font-family: 'Roboto Mono', monospace;
              font-size: 14px
              color: white
              margin: 0

          .audioDuration
            margin-left: auto;

            h1
              font-weight bold
              font-family: 'Roboto Mono', monospace;
              font-size: 14px
              color: white
              margin: 0
              transform: translateX(2px)
              opacity: 0.75

        .musicProgress
          width: 100%

          input
            -webkit-appearance: none
            width: 100%
            height: 7.5px;
            border-radius: 5px;
            background: $secondary
            background-image: -webkit-gradient(
                linear, 50% 0%, 50% 100%,
                color-stop(0%, #e67e22),
                color-stop(100%, #d35400));
            background-repeat: no-repeat;
            outline: none;
            padding: 0;
            transition: backgroundSize 0.15s

            &::-webkit-slider-thumb
              appearance: none
              width: 0
              height: @width
              border-radius: 50%
              background: #e67e22
              cursor: pointer
              transition: background .15s ease-in-out

  .player
    width 100vw
    background darken(white, 5%)
    display flex
    justify-content center
    align-items center
    flex-direction column
</style>
