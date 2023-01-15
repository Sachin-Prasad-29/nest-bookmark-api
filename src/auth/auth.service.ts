import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
    delete user.hash;
    return user;
  }
}
