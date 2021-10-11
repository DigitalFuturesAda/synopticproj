<template>
  <div class="player">
    <template v-if="currentSong">
      <h1>{{ currentSong.audioName }}</h1>
    </template>
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

  @musicQueue.Getter currentSong!: AudioFile;
  @musicQueue.Mutation addSong!: (state: AudioFile) => void;
  @musicQueue.Mutation nextSong!: () => void;

  public async mounted(): Promise<void> {
    new FileTransformer().parseAlbums().then(parsedResponse => {
      AlbumSingleton.getInstance().setStore(parsedResponse);

      let audioFile = AlbumSingleton.getInstance().getStore()["Black Holes and Revelations"].audioFiles[0];

      console.log("Adding song!")
      this.addSong(audioFile)


    });
  }
}
</script>

<style scoped lang="stylus">
  .player
    width 100vw
    height 20vh
    background darken(white, 5%)
    display flex
    justify-content center
    align-items center
</style>
