import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
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
    return await this.sessionRepo.save(newSession);
  }
}
