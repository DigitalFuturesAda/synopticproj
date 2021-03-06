import {playlistItem, playlistStore} from '@/types/AlbumMap';
import {AudioTransformer} from '@/core/audio/AudioTransformer';

export class PlaylistManager {
  private static instance: PlaylistManager;
  private static PLAYLIST_KEY = "PLAYLIST_STORE";

  private constructor() { }

  public static getOrCreate(): PlaylistManager {
    if (!PlaylistManager.instance) {
      PlaylistManager.instance = new PlaylistManager();
    }

    return PlaylistManager.instance;
  }

  public fetchUnprocessedPlaylistStore(): playlistStore {
    return PlaylistManager.getOrCreateStore();
  }

  public createPlaylist(name: string): string {
    if (name.length === 0){
      throw "Playlist name cannot be empty"
    }

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

    return "Created playlist!"
  }

  public deletePlaylist(name: string): string {
    let currentStore = PlaylistManager.getOrCreateStore();

    if (currentStore.findIndex(playlists => playlists.name === name) === -1){
      throw "Playlist does not exist!"
    }

    localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify(currentStore.filter(playlist => playlist.name !== name)));
    return "Deleted playlist!"
  }

  public removeFromPlaylist(name: string, audioId: number): string {
    let currentStore = PlaylistManager.getOrCreateStore();

    if (!currentStore.find(playlist => playlist.name === name)){
      throw "Playlist does not exist!"
    } else {
     let store = currentStore.find(playlist => playlist.name === name);

     if (store?.files && store.files.length === 1){
       throw "Cannot remove the last item in a playlist. Delete the entire playlist instead"
     }
    }

    if (!PlaylistManager.doesAlbumMapContainAudioId(audioId)){
      throw "audioId is not a recognised hash"
    }

    for (let item of currentStore){
      if (item.name === name){
        if (item.files.includes(audioId)){
          const id = item.files.findIndex(file => file === audioId);
          item.files.splice(id);
        }
      }
    }

    localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify(currentStore));
    return "Removed from playlist!"
  }

  public addToPlaylist(name: string, audioId: number): string {
    let currentStore = PlaylistManager.getOrCreateStore();

    if (!currentStore.find(playlist => playlist.name === name)){
      throw "Playlist does not exist!"
    }

    if (!PlaylistManager.doesAlbumMapContainAudioId(audioId)){
      throw "audioId is not a recognised hash"
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

    return "Added to playlist!"
  }

  private static getOrCreateStore(): playlistStore {
    const playlistStoreUnparsed = localStorage.getItem(PlaylistManager.PLAYLIST_KEY);
    if (playlistStoreUnparsed === null){
      localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify([]));
    }

    return JSON.parse(<string>localStorage.getItem(PlaylistManager.PLAYLIST_KEY));
  }

  private static doesAlbumMapContainAudioId(audioId: number): boolean {
    const albumMap = AudioTransformer.albumMap;
    if (albumMap === null){
      throw "Cannot add item to playlist. The albumMap is null!"
    }

    for (const album of Object.values(albumMap)) {
      for (let audioFile of album.audioFiles){
        if (audioFile.hash === audioId){
          return true
        }
      }
    }
    return false;
  }
}