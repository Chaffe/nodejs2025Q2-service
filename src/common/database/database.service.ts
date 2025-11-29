import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class DatabaseService {
  public users: User[] = [];
}