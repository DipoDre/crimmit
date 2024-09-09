import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schema/user.schema';

@Injectable()
export class AuthEncryptionService {
  private readonly jwt: Jwt;

  constructor(jwt: Jwt) {
    this.jwt = jwt;
  }

  // Validate JWT Token, throw error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Generate JWT Token
  public generateToken(auth: UserDocument): string {
    return this.jwt.sign({
      id: auth.id,
      email: auth.email,
    });
  }

  // Decoding the JWT Token
  public async decodeToken(token: string): Promise<unknown> {
    try {
      return this.jwt.decode(token, null);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Encode User's password
  public encodePassword(password: string) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string) {
    return bcrypt.compareSync(password, userPassword);
  }
}
