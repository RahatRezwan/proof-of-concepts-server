import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { IFindUser } from 'src/types/user.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = await this.userRepo.create(userData);
    user.password = await bcrypt.hash(user.password, 10);
    return this.userRepo.save(user);
  }

  async findOne(query: IFindUser) {
    return await this.userRepo.findOneBy(query);
  }

  async isPasswordMatched(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
