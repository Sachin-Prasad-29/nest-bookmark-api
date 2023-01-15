import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    // console.log({ user: req.user }); // ? we can get this req.user from validate method of strategy
    return user;
  }

 
}
