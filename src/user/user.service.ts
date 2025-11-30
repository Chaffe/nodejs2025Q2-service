import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserResponse } from './entities/user.entity';
import { AppService } from '../app.service';

@Injectable()
export class UserService {
  constructor(private readonly db: AppService) {}

  private toResponse(user: User): UserResponse {
    const { id, login, version, createdAt, updatedAt } = user;
    return {
      id,
      login,
      version,
      createdAt,
      updatedAt,
    };
  }

  findAll(): UserResponse[] {
    return this.db.users.map((user) => this.toResponse(user));
  }

  findOne(id: string): UserResponse {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponse(user);
  }

  create(createUserDto: CreateUserDto): UserResponse {
    const timestamp = Date.now();
    const newUser: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.db.users.push(newUser);
    return this.toResponse(newUser);
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    const userIndex = this.db.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const user = this.db.users[userIndex];

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    this.db.users[userIndex] = user;
    return this.toResponse(user);
  }

  remove(id: string): void {
    const userIndex = this.db.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.db.users.splice(userIndex, 1);
  }
}
