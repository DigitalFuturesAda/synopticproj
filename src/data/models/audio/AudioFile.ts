import {Album} from '@/data/models/audio/Album';
import Util from '@/core/util/Util';

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

  /**
   * Naive hashcode implementation. Generates a unique constant value deriving
   * from the values of the {@link AudioFile} instance.
   */
  get hash(): number {
    const prime: number = 3;
    let hash: number = 1;
    hash = prime * hash + Util.hashCode(this._audioName);
    hash = prime * hash + (this._durationSeconds ^ (this._durationSeconds >>> prime));
    hash = prime * hash + (((this.albumArt == null)
        ? 0
        : this.albumArt.byteLength ^ (this.albumArt.byteLength >>> prime) >>> this.albumArt?.byteOffset))
    return hash * -1;
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