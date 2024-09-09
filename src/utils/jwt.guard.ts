import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { AuthEncryptionService } from './util.secure';
import { UserDALService } from '../users/users.dal';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly authEncryptionService: AuthEncryptionService,
    private readonly userDALService: UserDALService,
  ) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const req: Request = ctx.switchToHttp().getRequest();

    // Verify authorization token
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    const decoded = await this.authEncryptionService.verify(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid Token');
    }

    // While token has not expired
    // Check if user's account has not been deleted
    const user = await this.userDALService.getUserByEmail(decoded.email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    req.body.userId = decoded.id;
    req.body.userEmail = decoded.email;

    return true;
  }
}
