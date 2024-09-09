import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { JwtGuard } from '../utils/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Put(':id')
  async updateUser(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(
      req.body.userId,
      id,
      updateUserDto,
    );
  }

  @Delete(':id')
  async deleteUser(@Req() req: any, @Param('id') id: string) {
    return await this.usersService.deleteUser(req.body.userId, id);
  }
}
