import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './entities/track.entity';
import { FavoriteTrack } from '../favorites/entities/favorite-track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, FavoriteTrack])],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
