import {Album} from '@/data/models/audio/Album';
import {albumMap} from '@/types/AlbumMap';

export class AlbumSingleton {
  private static instance: AlbumSingleton;
  private albumMap!: albumMap

  private constructor() {}

  public static getInstance(): AlbumSingleton {
    if (!AlbumSingleton.instance) {
      AlbumSingleton.instance = new AlbumSingleton();
    }

    return AlbumSingleton.instance;
  }

  public setStore(albumMap: { [name: string]: Album }){
    if (this.albumMap){
      // throw "Store already set!"
    }

    this.albumMap = albumMap;
  }

  public getStore(): albumMap {
    return this.albumMap;
  }
}