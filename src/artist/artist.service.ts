import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AppService } from '../app.service';

@Injectable()
export class ArtistService {
  constructor(private readonly db: AppService) {}

  findAll(): Artist[] {
    return this.db.artists;
  }

  findOne(id: string): Artist {
    const artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artistIndex = this.db.artists.findIndex((a) => a.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist: Artist = {
      ...this.db.artists[artistIndex],
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    this.db.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    const artistIndex = this.db.artists.findIndex((a) => a.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    const favIndex = this.db.favorites.artists.indexOf(id);
    if (favIndex !== -1) {
      this.db.favorites.artists.splice(favIndex, 1);
    }

    this.db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    this.db.artists.splice(artistIndex, 1);
  }
}