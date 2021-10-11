import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {AudioFile} from '@/data/models/audio/AudioFile';
import {namespace} from 'vuex-class';

@Module({ namespaced: true })
export default class PlayerState extends VuexModule {
  private _audioProgressPercent: number = 0;
  private _isPaused: boolean = true;

  @Mutation
  public setPausedState(isPaused: boolean){
    this._isPaused = isPaused;
  }

  @Mutation
  public setAudioProgress(audioProgressPercent: number){
    if (audioProgressPercent < 0 || audioProgressPercent > 100){
      throw "Cannot set songProgress to less than 0 or greater than 100"
    }

    this._audioProgressPercent = audioProgressPercent;
  }

  public get audioProgressPercent(): number {
    return isNaN(this._audioProgressPercent) ? 0 : this._audioProgressPercent;
  }

  public get isPaused(): boolean {
    return this._isPaused;
  }
}