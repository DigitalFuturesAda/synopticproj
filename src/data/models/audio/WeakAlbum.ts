import {Album} from '@/data/models/audio/Album';

export class WeakAlbum {
  private readonly _title: string;
  private readonly _author: string;
  private readonly _custom: boolean = false;

  constructor(album: Album) {
    this._title = album.title;
    this._author = album.author;
    this._custom = album.custom;
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
}