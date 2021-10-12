import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {AudioFile} from '@/data/models/audio/AudioFile';
import {Album} from '@/data/models/audio/Album';
import Util from '@/core/util/Util';

@Module({ namespaced: true })
export class MusicQueue extends VuexModule {
  private currentFileCounter: number = 0;
  private audioFilesQueue: Array<AudioFile> = new Array<AudioFile>();

  @Mutation
  public addSong(song: AudioFile){
    this.audioFilesQueue.push(song);
  };

  @Mutation
  public addAlbum(album: Album){
    album.audioFiles.forEach(audioFile => {
      this.audioFilesQueue.push(audioFile)
    })
  };

  @Mutation
  public nextSong(){
    if (this.currentFileCounter >= this.audioFilesQueue.length) return
    this.currentFileCounter ++;
  }

  @Mutation
  public previousSong(){
    if (this.currentFileCounter <= 0) return
    this.currentFileCounter --;
  }

  @Mutation
  public shufflePlaylist(){
    this.audioFilesQueue = Util.shuffleArray(this.audioFilesQueue);
  }

  public get currentSong(): AudioFile {
    return this.audioFilesQueue[this.currentFileCounter];
  }

  public get currentTrackNumber(): number {
    return this.currentFileCounter;
  }

  public get playlistLength(): number {
    return this.audioFilesQueue.length
  }
}
