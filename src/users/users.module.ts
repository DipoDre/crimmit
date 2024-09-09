import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserDALService } from './users.dal';
import { JwtGuard } from '../utils/jwt.guard';
import { AuthEncryptionService } from '../utils/util.secure';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserDALService, JwtGuard, AuthEncryptionService],
  exports: [UserDALService, AuthEncryptionService],
})
export class UsersModule {}
