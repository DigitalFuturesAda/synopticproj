<template>
  <div class="player">
    <template v-if="currentSong">
      <h1>{{ currentSong.audioName }}</h1>
    </template>

    <audio ref="audioInstance" autoplay controls :src = "computedCurrentSong"></audio>

    <p>Current duration {{ Math.round(audioProgressPercent) }}%</p>
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
const musicQueue  = namespace('MusicQueue');

@Component
export default class Player extends Vue {
  @Prop() private msg!: string;

  private trackProgress: number = 0;

  @musicQueue.Getter currentSong!: AudioFile;
  @musicQueue.Mutation addSong!: (state: AudioFile) => void;
  @musicQueue.Mutation nextSong!: () => void;

  @playerState.Mutation setAudioProgress!: (state: number) => void;
  @playerState.Getter audioProgressPercent!: number;

  get currentDuration(){
    return this.audioProgressPercent;
  }

  get computedCurrentSong(){
    if (this.currentSong){
      return this.currentSong.audioFileLocation;
    }

    return "";
  }

  public async mounted(): Promise<void> {
    new FileTransformer().parseAlbums().then(parsedResponse => {
      AlbumSingleton.getInstance().setStore(parsedResponse);

      let audioFile = AlbumSingleton.getInstance().getStore()["Black Holes and Revelations"].audioFiles;

      console.log("Adding song!")
      this.addSong(audioFile[0])
      this.addSong(audioFile[1])
      this.addSong(audioFile[2])
      this.addSong(audioFile[3])
      this.addSong(audioFile[4])

      // setTimeout( () => {
      //   console.log("Clearing!")
      //   this.nextSong()
      // }, 3000)

    });

    let audioInstance: HTMLAudioElement = <HTMLAudioElement>this.$refs.audioInstance;
    audioInstance.ontimeupdate = () => {
      this.setAudioProgress((audioInstance.currentTime / audioInstance.duration) * 100)
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
