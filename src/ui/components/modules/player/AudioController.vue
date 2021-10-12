<template>
  <div>
    <div class="player" >
      <template v-if="currentSong">
        <h1>{{ currentSong.audioName }}</h1>
      </template>

      <audio ref="audioInstance" autoplay :controls="debugOption_displayAudioElement" :src = "computedCurrentSong"></audio>

      <p>Current duration {{ audioProgressPercent }}%</p>

      <button v-on:click="playPauseButtonPress()">{{ isPaused ? "Play" : "Pause" }}</button>
      <button v-on:click="nextSong()" :disabled="isAudioQueueLastItem">Next song</button>
      <button v-on:click="previousSong" :disabled="isAudioQueueFirstItem">Previous song</button>
    </div>

    <div class = "audioController">
      <div class = "audioWrapper">
        <div class = "audioInformation">
          <div class = "audioCover">
            <img src="https://i.scdn.co/image/ab6761610000e5ebca77d763703a93930c363a39" alt="Album cover">
          </div>
          <div class = "artistInformation">
            <template v-if="currentSong">
              <h1>{{ currentSong.audioName }}</h1>
            </template>
            <h2>Daft Punk</h2>
          </div>
        </div>

        <div class = "audioSeeker">
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
          <div class = "labels">
            <div class = "currentTime">
              <h1>{{ currentAudioDuration }}</h1>
            </div>
            <div class = "audioDuration">
              <h1>{{ maximumAudioDuration }}</h1>
            </div>
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

const playerState = namespace('PlayerState');
const musicQueue = namespace('MusicQueue');

@Component
export default class AudioController extends Vue {
  private readonly debugOption_displayAudioElement = false;

  @musicQueue.Mutation addSong!: (state: AudioFile) => void;
  @musicQueue.Mutation nextSong!: () => void;
  @musicQueue.Mutation previousSong!: () => void;
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

  public playPauseButtonPress() {
    if (this.isPaused){
      this.audioInstance.play();
    } else {
      this.audioInstance.pause();
    }
  }

  public async mounted(): Promise<void> {
    new AudioTransformer().createAlbumMemoryCache().then(parsedResponse => {
      AlbumSingleton.getInstance().setStore(parsedResponse);

      let audioFile = AlbumSingleton.getInstance().getStore()["Black Holes and Revelations"].audioFiles;

      this.addSong(audioFile[3])
      this.addSong(audioFile[4])
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
        margin-bottom: 30px

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
            object-fit: contain

      .audioSeeker
        padding-bottom: 30px

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
