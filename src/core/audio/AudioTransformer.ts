import {Album} from '@/data/models/audio/Album';
import * as musicMetadata from 'music-metadata-browser';
import {AudioFile} from '@/data/models/audio/AudioFile';
import {albumMap} from '@/types/AlbumMap';
import {PlaylistManager} from '@/core/playlist/PlaylistManager';

export class AudioTransformer {
  private static _ALBUM_MAP: albumMap = {};

  public async createAlbumMemoryCache(): Promise<albumMap> {
    let albumMap = await AudioTransformer.parseFileMetadata();
    let playlistStore = PlaylistManager.getOrCreate().fetchUnprocessedPlaylistStore();

    for (let playlistData of playlistStore){
      const [name, audioIds] = [playlistData.name, playlistData.files];

      // Ignore playlists that are empty. They do not need to be committed to the
      // playlist map.
      if (audioIds.length === 0) continue

      if (!albumMap[playlistData.name]){
        albumMap[playlistData.name] = new Album(
            playlistData.name,
            "You",
            /* custom = */ true,
            new Array<AudioFile>()
        )
      }

      for (let audioId of audioIds){
        for (let albumData of Object.values(albumMap)){
          let audioFile = albumData.audioFiles.find(audioFileInstance => audioFileInstance.hash === audioId);
          if (audioFile && !albumMap[playlistData.name].audioFiles.includes(audioFile)){
            albumMap[playlistData.name].audioFiles.push(audioFile)
          }
        }
      }
    }

    AudioTransformer._ALBUM_MAP = albumMap;
    return albumMap;
  }

  private static async parseFileMetadata(): Promise<albumMap> {
     let albums: albumMap = {};

     for (let fileName of AudioTransformer.audioFilePathNames){
       const audioFile = require(`@/static/audio/${fileName}`);
       const audioMetadata = await musicMetadata.fetchFromUrl(audioFile);

       let audioFileInstance = new AudioFile(
           audioMetadata.common.title || "Unknown",
           audioMetadata.format.duration || NaN,
           audioMetadata.common.picture ? audioMetadata.common.picture[0].data : null,
           audioFile
       );

       if (!audioMetadata.common.album || !audioMetadata.common.artist){
         console.warn(`[WARN]: FileTransformer - Audio file: ${audioFileInstance.audioName} has no associated album or artist name`);
         continue;
       }

       if (!albums[audioMetadata.common.album]){
         albums[audioMetadata.common.album] = new Album(
             audioMetadata.common.album,
             audioMetadata.common.artist,
             /* custom = */ false,
             new Array<AudioFile>()
         )
       }

       albums[audioMetadata.common.album].audioFiles.push(audioFileInstance)
     }

     return albums;
  }

  private static get audioFilePathNames(): Array<String> {
    return require.context(
        "@/static/audio",
        true,
        /^.*\.mp3$/
    ).keys().map(fileName => fileName.substring(2));
  }

  static get albumMap(): albumMap | null {
    if (!this._ALBUM_MAP || Object.keys(this._ALBUM_MAP).length === 0){
      return null;
    }
    return this._ALBUM_MAP;
  }
}

