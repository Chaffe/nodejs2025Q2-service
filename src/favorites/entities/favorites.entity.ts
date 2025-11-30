import { Track } from '../../track/entities/track.entity';

export interface Favorites {
  tracks: string[];
}

export interface FavoritesResponse {
  tracks: Track[];
}