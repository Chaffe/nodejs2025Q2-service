import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import { FavoritesResponse } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): FavoritesResponse {
    const tracks = this.db.tracks.filter((track) =>
      this.db.favorites.tracks.includes(track.id),
    );

    return { tracks };
  }

  addTrack(id: string): { message: string } {
    const track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    if (!this.db.favorites.tracks.includes(id)) {
      this.db.favorites.tracks.push(id);
    }

    return { message: 'Track added to favorites' };
  }

  removeTrack(id: string): void {
    const index = this.db.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }
    this.db.favorites.tracks.splice(index, 1);
  }
}