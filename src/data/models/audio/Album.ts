import {AudioFile} from '@/data/models/audio/AudioFile';

export class Album {
  private readonly _albumName: string;
  private readonly _bandName: string;
  private readonly _audioFiles: Array<AudioFile>;

  constructor(albumName: string, bandName: string, audioFiles: Array<AudioFile>) {
    this._albumName = albumName;
    this._bandName = bandName;
    this._audioFiles = audioFiles;
  }

  get albumName(): string {
    return this._albumName;
  }

  get bandName(): string {
    return this._bandName;
  }

  get audioFiles(): Array<AudioFile> {
    return this._audioFiles;
  }
}