import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const parsedJwt = this.parseJwt(token);
      const nowUnix = new Date().valueOf();

      if (nowUnix > parsedJwt['exp'] * 1000) {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private parseJwt(token: string) {
    try {
      return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch {
      throw new UnauthorizedException();
    }
  }
}
