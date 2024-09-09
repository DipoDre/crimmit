import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.local.env', '.env'],
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid(
          'local',
          'development',
          'staging',
          'beta',
          'production',
        ),
        DATABASE_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
