import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseService } from './common/database/database.service';

@Module({
  imports: [
    UserModule,
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
