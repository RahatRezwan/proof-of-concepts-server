import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //get user data
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserData(@Param('id') id: string) {
    try {
      const result = await this.userService.findOne({ id: Number(id) });
      const { password, ...user } = result;
      return {
        message: 'Get user data successfully',
        data: user,
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
