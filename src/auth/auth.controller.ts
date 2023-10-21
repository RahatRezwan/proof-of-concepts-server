import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/login')
  async login(
    @Body() body: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.login(body);

      const Browser = req.get('User-Agent');

      res.cookie('access_token', token, {
        secure: true,
        httpOnly: true,
        maxAge: Number(this.configService.get<string>('SESSION_EXPIRED_IN')),
      });

      return {
        message: 'Login successfully',
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
      const { password, ...user } = result;
      return {
        message: 'Register successfully',
        data: user,
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
