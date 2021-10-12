import {Album} from '@/data/models/audio/Album';

export type albumMap = { [name: string]: Album }

export interface playlistItem {
  name: string,
  files: number[]
}
export type playlistStore = playlistItem[]