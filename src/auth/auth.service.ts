import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signUp() {
    return { msg: 'I am signed Up' };
  }
  signIn() {
    return { msg: 'I am signed In' };
  }
}
