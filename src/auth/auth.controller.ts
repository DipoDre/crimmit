import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.login(loginAuthDto);
  }
}
