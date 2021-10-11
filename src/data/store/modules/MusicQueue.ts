import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {AudioFile} from '@/data/models/audio/AudioFile';
import {Album} from '@/data/models/audio/Album';

@Module({ namespaced: true })
export class MusicQueue extends VuexModule {
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
    this.audioFilesQueue.shift();
  }

  @Mutation
  public shufflePlaylist(){
    throw "Not yet implemented!";
  }

  public get currentSong(): AudioFile {
    return this.audioFilesQueue[0];
  }
}
