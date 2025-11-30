import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Track } from '../../track/entities/track.entity';
import { Favorites } from '../../favorites/entities/favorites.entity';
import { Album } from '../../album/entities/album.entity';

@Injectable()
export class DatabaseService {
  public users: User[] = [];
  public tracks: Track[] = [];
  public albums: Album[] = [];
  public favorites: Favorites = {
    // artists: [],
    albums: [],
    tracks: [],
  };
}