import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/login')
  async login(@Body() body: User, @Res({ passthrough: true }) res: Response) {
    try {
      const token = await this.authService.login(body);

      res.cookie('sessionId', token, {
        secure: true,
        httpOnly: true,
        expires: new Date(this.configService.get<string>('SESSION_EXPIRED_IN')),
      });

      return {
        message: 'Login successfully',
        data: token,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        message: 'Login failed',
        data: error,
      };
    }
  }

  @Post('/register')
  async register(@Body() body: User) {
    try {
      const result = await this.authService.register(body);
      return {
        message: 'Register successfully',
        data: result,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        message: 'Register failed',
        data: error,
      };
    }
  }
}
