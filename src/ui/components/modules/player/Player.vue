<template>
  <div class="player">
    <template v-if="currentSong">
      <h1>{{ currentSong.audioName }}</h1>
    </template>

    <audio ref="audioInstance" autoplay controls :src = "computedCurrentSong"></audio>

    <p>Current duration {{ Math.round(audioProgressPercent) }}%</p>

    <button v-on:click="playPauseButtonPress()">{{ isPaused ? "Play" : "Pause" }}</button>
    <button v-on:click="nextSong()" :disabled="isAudioQueueLastItem">Next song</button>
    <button v-on:click="previousSong" :disabled="isAudioQueueFirstItem">Previous song</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FileTransformer } from "@/core/audio/FileTransformer";
import { AlbumSingleton } from "@/core/audio/AlbumSingleton";
import { namespace } from 'vuex-class';
import { AudioFile } from '@/data/models/audio/AudioFile';
import PlayerState from '@/data/store/modules/PlayerState';

const playerState = namespace('PlayerState');
const musicQueue = namespace('MusicQueue');

@Component
export default class Player extends Vue {
  @Prop() private msg!: string;

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

  audioInstance!: HTMLAudioElement;

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
    this.audioInstance = <HTMLAudioElement>this.$refs.audioInstance;

    new FileTransformer().parseAlbums().then(parsedResponse => {
      AlbumSingleton.getInstance().setStore(parsedResponse);

      let audioFile = AlbumSingleton.getInstance().getStore()["Black Holes and Revelations"].audioFiles;

      console.log("Adding song!")
      this.addSong(audioFile[0])
      this.addSong(audioFile[1])
      this.addSong(audioFile[2])
      this.addSong(audioFile[3])
      this.addSong(audioFile[4])

      setTimeout( () => {
        console.log("Next!")
        this.nextSong()
      }, 3000)
    });

    this.audioInstance.ontimeupdate = () => {
      this.setAudioProgress((this.audioInstance.currentTime / this.audioInstance.duration) * 100)
    }

    this.audioInstance.onpause = () => {
      this.setPausedState(true);
    }

    this.audioInstance.onplay = () => {
      this.setPausedState(false);
    }
  }
}
</script>

<style scoped lang="stylus">
  .player
    width 100vw
    background darken(white, 5%)
    display flex
    justify-content center
    align-items center
    flex-direction column
</style>
