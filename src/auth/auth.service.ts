import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { UserDALService } from '../users/users.dal';
import { AuthEncryptionService } from '../utils/util.secure';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDALService: UserDALService,
    private readonly authEncryptionService: AuthEncryptionService,
  ) {}

  // Create new User
  async register(registerAuthDto: RegisterAuthDto) {
    const { email, password } = registerAuthDto;

    // Check if email is available
    const user = await this.userDALService.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('Email taken');
    }

    // Save User with hashed password
    registerAuthDto.password =
      this.authEncryptionService.encodePassword(password);

    const newUser = await this.userDALService.createUser(registerAuthDto);

    // Create & return token
    const token = this.authEncryptionService.generateToken(newUser);
    return { statusCode: HttpStatus.OK, error: null, data: token };
  }

  // Login existing user
  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    // Check if user exist
    const user = await this.userDALService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    // Verify password
    const passwordValidity = this.authEncryptionService.isPasswordValid(
      password,
      user.password,
    );

    if (!passwordValidity) {
      throw new BadRequestException('invalid credentials');
    }

    // Create & return token
    const token = this.authEncryptionService.generateToken(user);
    return { statusCode: HttpStatus.OK, error: null, data: token };
  }
}
