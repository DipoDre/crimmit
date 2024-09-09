import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: 'Invalid email format' })
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class RegisterAuthDto {
  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public password: string;
}
