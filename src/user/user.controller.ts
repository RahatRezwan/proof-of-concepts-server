import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //get user data
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserData(id: number) {
    try {
      const result = await this.userService.findOne({ id });
      return {
        message: 'Get user data successfully',
        data: result,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        message: 'Get user data failed',
        data: error,
      };
    }
  }
}
