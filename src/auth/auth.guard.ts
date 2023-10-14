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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = this.extractTokenFromCookies(request);
    console.log({ sessionId });
    if (!sessionId) {
      throw new UnauthorizedException();
    }

    try {
      //get session by sessionId
      const session = await this.sessionService.getSessionBy({
        id: Number(sessionId),
      });

      //   if (!session) {
      //     throw new UnauthorizedException();
      //   }

      const payload = await this.jwtService.verifyAsync(session.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      console.log({ payload });

      //error if payload is expired or invalid
      if (!payload) {
        throw new UnauthorizedException();
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const cookies = request.cookies;
    console.log({ cookies });
    if (cookies) {
      return cookies['sessionId'];
    }
  }
}
