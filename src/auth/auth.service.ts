import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  //register user
  async register(userData: Partial<User>) {
    //check if user exists
    const isExist = await this.userService.findOne({ email: userData.email });
    if (isExist) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userService.create(userData);
    return user;
  }

  //login user
  async login(userData: Partial<User>) {
    const isExist = await this.userService.findOne({ email: userData.email });
    if (!isExist) {
      throw new BadRequestException('User Not Found');
    }

    const isPasswordMatched = await this.userService.isPasswordMatched(
      userData.password,
      isExist.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid Password');
    }

    const access_token = this.jwtService.sign({
      email: isExist.email,
      id: isExist.id,
    });

    const session = {
      userId: isExist.id,
      email: isExist.email,
      token: access_token,
    };

    const sessionData = await this.sessionService.createSession(session);

    return sessionData.id;
  }
}
