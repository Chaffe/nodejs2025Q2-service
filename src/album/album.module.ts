import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { FavoriteAlbum } from '../favorites/entities/favorite-album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, FavoriteAlbum])],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
