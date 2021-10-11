import {Album} from '@/data/models/audio/Album';
import * as musicMetadata from 'music-metadata-browser';
import {AudioFile} from '@/data/models/audio/AudioFile';

export class FileTransformer {
  public async parseAlbums(): Promise<{ [name: string]: Album }> {
     let albums: { [name: string]: Album } = {};

     for (let fileName of FileTransformer.audioFilePathNames){
       const audioFilePath = `@/static/audio/${fileName}`;
       // console.log(`[DEBUG]: FileTransformer - Parsing: ${audioFilePath}`);

       const audioFile = require(`@/static/audio/${fileName}`);
       const audioInstance = new Audio(audioFile);
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
}

