import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { Artist } from './entities/artist.entity';
import { FavoriteArtist } from '../favorites/entities/favorite-artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, FavoriteArtist])],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}