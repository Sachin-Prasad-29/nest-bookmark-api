import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signUp(dto: AuthDto) {
    try {
      // todo  generate the password hash
      const hash = await argon.hash(dto.password);
      // todo save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        }
      });
      delete user.hash;
      // todo return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials incorrect');
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    // todo: find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email
      }
    });

    // todo: if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // todo: compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // todo: password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // todo: send back the user
    // delete user.hash;
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret
    });

    return { access_token: token };
  }
}
