import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { IFindSession } from 'src/types/session.types';
// import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async createSession(session: Partial<Session>) {
    const newSession = await this.sessionRepo.create(session);
    newSession.token = await bcrypt.hash(newSession.token, 10);
    await this.sessionRepo.save(newSession);
  }

  async getSessionBy(query: IFindSession) {
    return await this.sessionRepo.findOneBy(query);
  }

  async deleteSessionBy(id: number) {
    return await this.sessionRepo.delete({ id });
  }
}
