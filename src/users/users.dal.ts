import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schema/user.schema';
import { RegisterAuthDto } from '../auth/dto/auth.dto';

// Data Access Layer (Service)
@Injectable()
export class UserDALService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  // Get all Users
  async getUsers() {
    const users = await this.userModel.find().sort({ createdAt: 'desc' });

    return users;
  }

  // Get a User
  async getUser(userId: string) {
    const user = await this.userModel.findById(userId).catch((error) => {
      if (error.kind === 'ObjectId') {
        throw new BadRequestException('Invalid ID');
      }

      throw new UnprocessableEntityException();
    });

    return user;
  }

  // Get a User by Email
  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  // Update a User
  async updateUser(userId: string, data) {
    const user = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    return user;
  }

  // Delete a User
  async deleteUser(userId: string) {
    const result = await this.userModel.findByIdAndDelete(userId); // returns {deletedCount: 1}
    return result;
  }

  // Create a User
  async createUser(data: RegisterAuthDto) {
    const user = await this.userModel.create(data);
    return user;
  }
}
