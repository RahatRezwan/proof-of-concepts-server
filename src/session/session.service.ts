import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { IFindSession } from 'src/types/session.types';
// import { JwtModule } from '@nestjs/jwt';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>, // private jwtService: JwtModule,
  ) {}

  async createSession(session: Partial<Session>) {
    const newSession = await this.sessionRepo.create(session);
    // newSession.token = await bcrypt.hash(newSession.token, 10);
    return await this.sessionRepo.save(newSession);
  }

  async getSessionBy(query: IFindSession) {
    return await this.sessionRepo.findOneBy(query);
  }

  async deleteSessionBy(id: number) {
    return await this.sessionRepo.delete({ id });
  }

  // async isTokenExpired(userId) {
  //   const session = await this.sessionRepo.findOneBy({ userId });
  //   const isExpired = await
  //   return isExpired;
  // }
}
