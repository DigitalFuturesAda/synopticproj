import {Album} from '@/data/models/audio/Album';
import {albumMap, playlistItem, playlistStore} from '@/types/AlbumMap';

// this relies on the albulm map being defined.
export class PlaylistManager {
  private static PLAYLIST_KEY = "PLAYLIST_STORE";

  public fetchPlaylists(): albumMap | null {
    let currentStore = PlaylistManager.getOrCreateStore();

    return null;
  }

  public createPlaylist(name: string){
    let currentStore = PlaylistManager.getOrCreateStore();

    for (let item of currentStore){
      if (item.name === name){
        throw "Playlist name already exists!";
      }
    }

    const playlist: playlistItem = {
      name: name,
      files: []
    };

    currentStore.push(playlist)
    localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify(currentStore));
  }

  public addToPlaylist(name: string, audioId: string){
    let currentStore = PlaylistManager.getOrCreateStore();

    if (currentStore.find(playlist => playlist.name !== name)){
      throw "Playlist does not exist!"
    }

    for (let item of currentStore){
      if (item.name === name){
        if (item.files.includes(audioId)){
          throw "Playlist already contains item"
        }
        item.files.push(audioId)
      }
    }

    localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify(currentStore));
  }

  private static getOrCreateStore(): playlistStore {
    const playlistStoreUnparsed = localStorage.getItem(PlaylistManager.PLAYLIST_KEY);
    if (playlistStoreUnparsed === null){
      localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify([]));
    }

    return JSON.parse(<string>localStorage.getItem(PlaylistManager.PLAYLIST_KEY));
  }
}