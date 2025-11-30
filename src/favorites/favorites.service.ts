import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse } from './entities/favorites.entity';
import { AppService } from '../app.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: AppService) {}

  findAll(): FavoritesResponse {
    const artists = this.db.artists.filter((artist) =>
      this.db.favorites.artists.includes(artist.id),
    );
    const albums = this.db.albums.filter((album) =>
      this.db.favorites.albums.includes(album.id),
    );
    const tracks = this.db.tracks.filter((track) =>
      this.db.favorites.tracks.includes(track.id),
    );

    return { artists, albums, tracks };
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

  addArtist(id: string): { message: string } {
    const artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    if (!this.db.favorites.artists.includes(id)) {
      this.db.favorites.artists.push(id);
    }

    return { message: 'Artist added to favorites' };
  }

  removeArtist(id: string): void {
    const index = this.db.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }
    this.db.favorites.artists.splice(index, 1);
  }
}
