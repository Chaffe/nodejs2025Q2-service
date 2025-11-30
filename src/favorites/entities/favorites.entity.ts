import { Track } from '../../track/entities/track.entity';
import { Album } from '../../album/entities/album.entity';

export interface Favorites {
  tracks: string[];
  albums: string[];
}

export interface FavoritesResponse {
  tracks: Track[];
  albums: Album[];
}