import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SessionService } from 'src/session/session.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException("You don't have any token");
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload) {
        throw new UnauthorizedException('Unauthorized Access');
      }

      //get session by
      const session = await this.sessionService.getSessionBy({
        userId: Number(payload.id),
      });

      if (!session) {
        throw new UnauthorizedException('Session not found');
      }

      //compare token
      const isTokenValid = await bcrypt.compare(token, session.token);
      if (!isTokenValid) {
        throw new UnauthorizedException('Your token is invalid');
      }

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const cookies = request.cookies;
    if (cookies) {
      return cookies['access_token'];
    }
  }
}
