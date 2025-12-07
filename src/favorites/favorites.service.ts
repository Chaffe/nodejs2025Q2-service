import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { FavoritesResponse } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteArtist)
    private readonly favoriteArtistRepository: Repository<FavoriteArtist>,
    @InjectRepository(FavoriteAlbum)
    private readonly favoriteAlbumRepository: Repository<FavoriteAlbum>,
    @InjectRepository(FavoriteTrack)
    private readonly favoriteTrackRepository: Repository<FavoriteTrack>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favoriteArtists = await this.favoriteArtistRepository.find({
      relations: ['artist'],
    });
    const favoriteAlbums = await this.favoriteAlbumRepository.find({
      relations: ['album'],
    });
    const favoriteTracks = await this.favoriteTrackRepository.find({
      relations: ['track'],
    });

    return {
      artists: favoriteArtists.map((fa) => fa.artist),
      albums: favoriteAlbums.map((fa) => fa.album),
      tracks: favoriteTracks.map((ft) => ft.track),
    };
  }

  async addTrack(id: string): Promise<{ message: string }> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const existing = await this.favoriteTrackRepository.findOne({
      where: { trackId: id },
    });
    if (!existing) {
      const favoriteTrack = this.favoriteTrackRepository.create({
        trackId: id,
      });
      await this.favoriteTrackRepository.save(favoriteTrack);
    }

    return { message: 'Track added to favorites' };
  }

  async removeTrack(id: string): Promise<void> {
    const favoriteTrack = await this.favoriteTrackRepository.findOne({
      where: { trackId: id },
    });
    if (!favoriteTrack) {
      throw new NotFoundException('Track not found in favorites');
    }
    await this.favoriteTrackRepository.remove(favoriteTrack);
  }

  async addAlbum(id: string): Promise<{ message: string }> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const existing = await this.favoriteAlbumRepository.findOne({
      where: { albumId: id },
    });
    if (!existing) {
      const favoriteAlbum = this.favoriteAlbumRepository.create({
        albumId: id,
      });
      await this.favoriteAlbumRepository.save(favoriteAlbum);
    }

    return { message: 'Album added to favorites' };
  }

  async removeAlbum(id: string): Promise<void> {
    const favoriteAlbum = await this.favoriteAlbumRepository.findOne({
      where: { albumId: id },
    });
    if (!favoriteAlbum) {
      throw new NotFoundException('Album not found in favorites');
    }
    await this.favoriteAlbumRepository.remove(favoriteAlbum);
  }

  async addArtist(id: string): Promise<{ message: string }> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const existing = await this.favoriteArtistRepository.findOne({
      where: { artistId: id },
    });
    if (!existing) {
      const favoriteArtist = this.favoriteArtistRepository.create({
        artistId: id,
      });
      await this.favoriteArtistRepository.save(favoriteArtist);
    }

    return { message: 'Artist added to favorites' };
  }

  async removeArtist(id: string): Promise<void> {
    const favoriteArtist = await this.favoriteArtistRepository.findOne({
      where: { artistId: id },
    });
    if (!favoriteArtist) {
      throw new NotFoundException('Artist not found in favorites');
    }
    await this.favoriteArtistRepository.remove(favoriteArtist);
  }
}
