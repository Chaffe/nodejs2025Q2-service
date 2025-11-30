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
    const albums = this.db.albums.filter((album) =>
      this.db.favorites.albums.includes(album.id),
    );
    const tracks = this.db.tracks.filter((track) =>
      this.db.favorites.tracks.includes(track.id),
    );

    return { albums, tracks };
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

  addAlbum(id: string): { message: string } {
    const album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    if (!this.db.favorites.albums.includes(id)) {
      this.db.favorites.albums.push(id);
    }

    return { message: 'Album added to favorites' };
  }

  removeAlbum(id: string): void {
    const index = this.db.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }
    this.db.favorites.albums.splice(index, 1);
  }
}