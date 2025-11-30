import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Track } from '../../track/entities/track.entity';
import { Favorites } from '../../favorites/entities/favorites.entity';

@Injectable()
export class DatabaseService {
  public users: User[] = [];
  public tracks: Track[] = [];
  public favorites: Favorites = {
    // artists: [],
    // albums: [],
    tracks: [],
  };
}