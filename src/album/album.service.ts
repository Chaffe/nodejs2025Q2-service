import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../common/database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Album[] {
    return this.db.albums;
  }

  findOne(id: string): Album {
    const album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const albumIndex = this.db.albums.findIndex((a) => a.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum: Album = {
      ...this.db.albums[albumIndex],
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId ?? this.db.albums[albumIndex].artistId,
    };

    this.db.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): void {
    const albumIndex = this.db.albums.findIndex((a) => a.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    // Remove from favorites
    const favIndex = this.db.favorites.albums.indexOf(id);
    if (favIndex !== -1) {
      this.db.favorites.albums.splice(favIndex, 1);
    }

    // Nullify albumId in tracks
    this.db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    this.db.albums.splice(albumIndex, 1);
  }
}