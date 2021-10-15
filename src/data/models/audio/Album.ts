import {AudioFile} from '@/data/models/audio/AudioFile';
import Util from '@/core/util/Util';

export class Album {
  private readonly _title: string;
  private readonly _author: string;
  private readonly _custom: boolean = false;
  private readonly _audioFiles: Array<AudioFile>;

  constructor(title: string, author: string, custom: boolean, audioFiles: Array<AudioFile>) {
    this._title = title;
    this._author = author;
    this._audioFiles = audioFiles;
    this._custom = custom;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get custom(): boolean {
    return this._custom;
  }

  get albumCover(): Buffer | null {
    return this._audioFiles[0]?.albumArt || null
  }

  get audioFiles(): Array<AudioFile> {
    return this._audioFiles;
  }

  get hashcode(): number {
    const prime: number = 3;
    let hash: number = 1;
    hash = prime * hash + Util.hashCode(this._author);
    hash = prime * hash + Util.hashCode(this._title);
    for (let audioFileHash of this._audioFiles.map(
        audioFile => Number.parseInt(audioFile.hash.toString().substr(0, 4))
    )){
      hash = prime * audioFileHash
    }
    return (hash + (this._custom ? 1000 : -1000)) * -1;
  }
}