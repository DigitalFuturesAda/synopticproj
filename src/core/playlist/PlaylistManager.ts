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
    let currentStore = PlaylistManager.getOrCreateStore();

    for (let item of currentStore){
      if (item.name === name){
        return "Playlist name already exists!";
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

  public addToPlaylist(name: string, audioId: number): string {
    let currentStore = PlaylistManager.getOrCreateStore();

    if (!currentStore.find(playlist => playlist.name === name)){
      return "Playlist does not exist!"
    }

    if (!PlaylistManager.doesAlbumMapContainAudioId(audioId)){
      return "audioId is not a recognised hash"
    }

    for (let item of currentStore){
      if (item.name === name){
        if (item.files.includes(audioId)){
          return "Playlist already contains item"
        }
        item.files.push(audioId)
      }
    }

    localStorage.setItem(PlaylistManager.PLAYLIST_KEY, JSON.stringify(currentStore));

    return "Added to Playlist!"
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