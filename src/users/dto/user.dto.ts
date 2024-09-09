import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  public readonly firstName?: string;

  @IsOptional()
  @IsString()
  public readonly lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  public readonly password?: string;
}
