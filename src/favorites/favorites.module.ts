import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { DatabaseService } from '../common/database/database.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, DatabaseService],
  exports: [FavoritesService],
})
export class FavoritesModule {}