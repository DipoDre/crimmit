import {
  Injectable,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
import { UserDALService } from './users.dal';
import { UserDocument } from './schema/user.schema';
import { AuthEncryptionService } from '../utils/util.secure';

@Injectable()
export class UsersService {
  constructor(
    private readonly userDALService: UserDALService,
    private readonly authEncryptionService: AuthEncryptionService,
  ) {}

  // Get all Users
  async getUsers() {
    const users = await this.userDALService.getUsers();

    if (users.length < 1) {
      return {
        statusCode: HttpStatus.OK,
        error: null,
        data: { users: [] },
      };
    }

    const allUsers = users.map((user) => {
      return this.build(user);
    });

    return {
      statusCode: HttpStatus.OK,
      error: null,
      data: { users: allUsers },
    };
  }

  // Get a User
  async getUser(id: string) {
    const user = await this.userDALService.getUser(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return {
      statusCode: HttpStatus.OK,
      error: null,
      data: { user: this.build(user) },
    };
  }

  // Update a User
  async updateUser(userId: string, id: string, updateUserDto: UpdateUserDto) {
    if (userId != id) {
      throw new ForbiddenException();
    }

    const { firstName, lastName, password } = updateUserDto;

    if (!firstName && !lastName && !password) {
      throw new BadRequestException('empty payload');
    }

    const updatePayload = { firstName, lastName, password };

    if (password) {
      updatePayload.password =
        this.authEncryptionService.encodePassword(password);
    }

    const updatedUser = await this.userDALService.updateUser(id, updatePayload);

    return {
      statusCode: HttpStatus.OK,
      error: null,
      data: { user: this.build(updatedUser) },
    };
  }

  // Delete a User
  async deleteUser(userId: string, id: string) {
    if (userId != id) {
      throw new ForbiddenException();
    }

    const deleteResult = await this.userDALService.deleteUser(id);

    if (!deleteResult) {
      throw new BadRequestException('User was not deleted');
    } else {
      return {
        statusCode: HttpStatus.OK,
        error: null,
        data: 'User was deleted successfully',
      };
    }
  }

  // Build user data
  public build(user: UserDocument) {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
