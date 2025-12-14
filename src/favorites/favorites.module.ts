import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteArtist,
      FavoriteAlbum,
      FavoriteTrack,
      Artist,
      Album,
      Track,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
