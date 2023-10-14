import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //get user data
  //   @Get('/:id')
  //   async getUserData(id: number) {
  //     try {
  //       const result = await this.userService.getUserData(id);
  //       return {
  //         message: 'Get user data successfully',
  //         data: result,
  //       };
  //     } catch (error) {
  //       console.log('Error: ', error);
  //       return {
  //         message: 'Get user data failed',
  //         data: error,
  //       };
  //     }
  //   }
}
