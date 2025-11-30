import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DatabaseService } from './common/database/database.service';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
