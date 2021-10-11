import {Album} from '@/data/models/audio/Album';

export class AudioFile {
  private readonly _audioName: string;
  private readonly _durationSeconds: number;
  private readonly _albumArt: Buffer | null;
  private readonly _audioFileLocation: string;

  private _album!: Album;

  constructor(audioName: string, durationSeconds: number, albumArt: Buffer | null, audioFileLocation: string) {
    this._audioName = audioName;
    this._durationSeconds = durationSeconds;
    this._albumArt = albumArt;
    this._audioFileLocation = audioFileLocation;
  }

  get album(): Album {
    return this._album;
  }

  set album(value: Album) {
    this._album = value;
  }

  get audioName(): string {
    return this._audioName;
  }

  get durationSeconds(): number {
    return this._durationSeconds;
  }

  get albumArt(): Buffer | null {
    return this._albumArt;
  }

  get audioFileLocation(): string {
    return this._audioFileLocation;
  }
}