import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {AudioFile} from '@/data/models/audio/AudioFile';

@Module({ namespaced: true })
export default class PlayerState extends VuexModule {
  public songProgressPercent: number = 0;
  public isPaused: boolean = true;

  @Mutation
  public togglePausedState(){
    this.isPaused = !this.isPaused;
  }

  @Mutation
  public setSongProgress(songProgressPercent: number){
    if (songProgressPercent < 0 || songProgressPercent > 100){
      throw "Cannot set songProgress to less than 0 or greater than 100"
    }

    this.songProgressPercent = songProgressPercent;
  }
}