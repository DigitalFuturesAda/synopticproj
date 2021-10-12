import {AudioTransformer} from '@/core/audio/AudioTransformer';
import {AudioFile} from '@/data/models/audio/AudioFile';

export class AudioSearch {
  public searchForAudioFile(keyword: string): Array<AudioFile> {
    let albumMap = AudioTransformer.albumMap;
    let audioFileMap = new Array<AudioFile>();

    if (!albumMap || Object.keys(albumMap).length === 0){
      throw "Cannot search - albumMap not yet set.";
    }

    for (let albumData of Object.values(albumMap)){
      for (let audioFile of albumData.audioFiles){
        if (audioFile.audioName.toLowerCase().includes(keyword.toLowerCase())){
          if (!audioFileMap.includes(audioFile)){
            audioFileMap.push(audioFile)
          }
        }
      }
    }

    return audioFileMap;
  }
}