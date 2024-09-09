import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDALService } from '../users/users.dal';
import { AuthEncryptionService } from '../utils/util.secure';
import { UserDocument as User } from '../users/schema/user.schema';
import { BadRequestException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserDALService: Partial<UserDALService>;
  let fakeAuthEncryptionService: Partial<AuthEncryptionService>;

  beforeEach(async () => {
    fakeUserDALService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getUserByEmail: (email: string) => Promise.resolve(null),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createUser: ({ firstName, lastName, email, password }) =>
        Promise.resolve({
          _id: '66dce6037c21e05be2098636',
          email,
          firstName,
          lastName,
        } as User | any),
    };
    fakeAuthEncryptionService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      encodePassword: (password: string) =>
        'xcvnmbjjfhfuyiidkdhdhhjdjdjkkmcchfhdjfjdkkk',
      generateToken: () =>
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZGNlM2JmYWZkYTk2NjIyNj',
      isPasswordValid: () => false,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserDALService,
          useValue: fakeUserDALService,
        },
        {
          provide: AuthEncryptionService,
          useValue: fakeAuthEncryptionService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can create a new user and return token', async () => {
    const result = await service.register({
      firstName: 'Kunle',
      lastName: 'Hamilton',
      email: 'kunlenzo@gmail.com',
      password: 'la@cremey',
    });

    expect(result.statusCode).toEqual(HttpStatus.OK);
    expect(result.data).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZGNlM2JmYWZkYTk2NjIyNj',
    );
    expect(result.error).toBeNull();
  });

  it('throws an error if unregistered user logs in', async () => {
    await expect(
      service.login({
        email: 'kunlenzo@gmail.com',
        password: 'la@cremey',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUserDALService.getUserByEmail = (email) =>
      Promise.resolve({
        _id: '66dce6037c21e05be2098636',
        email,
        firstName: 'Kunle',
        lastName: 'Hamilton',
      } as User | any);
    await expect(
      service.register({
        firstName: 'Kunle',
        lastName: 'Hamilton',
        email: 'kunlenzo@gmail.com',
        password: 'la@cremey',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
