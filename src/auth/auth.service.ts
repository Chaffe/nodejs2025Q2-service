import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AppService } from '../app.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserResponse } from '../user/entities/user.entity';

interface TokenPayload {
  userId: string;
  login: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: AppService,
    private readonly jwtService: JwtService,
  ) {}

  private toResponse(user: User): UserResponse {
    const { id, login, version, createdAt, updatedAt } = user;
    return { id, login, version, createdAt, updatedAt };
  }

  private async generateTokens(payload: TokenPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signup(signupDto: SignupDto): Promise<UserResponse> {
    const saltRounds = parseInt(process.env.CRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);

    const timestamp = Date.now();
    const newUser: User = {
      id: randomUUID(),
      login: signupDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.db.users.push(newUser);
    return this.toResponse(newUser);
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = this.db.users.find((u) => u.login === loginDto.login);

    if (!user) {
      throw new ForbiddenException('Authentication failed: user not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Authentication failed: wrong password');
    }

    const payload: TokenPayload = {
      userId: user.id,
      login: user.login,
    };

    return this.generateTokens(payload);
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );

      const user = this.db.users.find((u) => u.id === payload.userId);

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const newPayload: TokenPayload = {
        userId: user.id,
        login: user.login,
      };

      return this.generateTokens(newPayload);
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
