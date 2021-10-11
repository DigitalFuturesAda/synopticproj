import {AudioFile} from '@/data/models/audio/AudioFile';

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

  get audioFiles(): Array<AudioFile> {
    return this._audioFiles;
  }
}