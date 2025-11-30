import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DatabaseService } from './common/database/database.service';

@Module({
  imports: [
    UserModule,
    TrackModule,
    FavoritesModule,
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
