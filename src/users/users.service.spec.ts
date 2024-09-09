import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserDALService } from './users.dal';
import { AuthEncryptionService } from '../utils/util.secure';
import { UserDocument as User } from '../users/schema/user.schema';
import {
  ForbiddenException,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserDALService: Partial<UserDALService>;
  let fakeAuthEncryptionService: Partial<AuthEncryptionService>;

  beforeEach(async () => {
    const users: any[] = [
      {
        _id: '66dce6037c21e05be2098636',
        firstName: 'Ololade',
        lastName: 'Asake',
      },
      {
        _id: '66dce5e57c21e05be2098633',
        firstName: 'Bankole',
        lastName: 'Wellington',
      },
      {
        _id: '66dce3bfafda9662267dd1a9',
        firstName: 'Kunle',
        lastName: 'Hamilton',
      },
    ];

    fakeUserDALService = {
      getUsers: () => Promise.resolve(users),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getUser: (id: string) => Promise.resolve(null),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateUser: (id, { firstName, lastName, password }) =>
        Promise.resolve({
          _id: id,
          email: 'kunlenzo@gmail.com',
          firstName,
          lastName,
        } as User | any),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      deleteUser: (id: string) => Promise.resolve(null),
    };

    fakeAuthEncryptionService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      encodePassword: (password: string) =>
        'xcvnmbjjfhfuyiidkdhdhhjdjdjkkmcchfhdjfjdkkk',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns list of users', async () => {
    const result = await service.getUsers();

    expect(result.statusCode).toEqual(HttpStatus.OK);
    expect(result.data.users).toHaveLength(3);
    expect(result.error).toBeNull();
  });

  it('throws an error if user not found', async () => {
    await expect(service.getUser('66dce6037c21e05be2098636')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if user tries to update another user', async () => {
    await expect(
      service.updateUser(
        '66dce6037c21e05be2098636',
        '66dce3bfafda9662267dd1a9',
        {
          firstName: 'Ololade',
          lastName: 'Asiwaju',
          password: 'er23th79@wq',
        },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws an error if user tries to update with no value provided', async () => {
    await expect(
      service.updateUser(
        '66dce6037c21e05be2098636',
        '66dce6037c21e05be2098636',
        {},
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('updates a user', async () => {
    const result = await service.updateUser(
      '66dce6037c21e05be2098636',
      '66dce6037c21e05be2098636',
      {
        firstName: 'Ololade',
        lastName: 'Asiwaju',
        password: 'er23th79@wq',
      },
    );

    expect(result.statusCode).toEqual(HttpStatus.OK);
    expect(result.data.user).toEqual({
      id: '66dce6037c21e05be2098636',
      firstName: 'Ololade',
      lastName: 'Asiwaju',
    });
    expect(result.error).toBeNull();
  });

  it('throws an error if user tries to delete another user', async () => {
    await expect(
      service.deleteUser(
        '66dce6037c21e05be2098636',
        '66dce3bfafda9662267dd1a9',
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
