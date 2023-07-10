import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import config from 'src/config/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Error sin autorización');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwtSecret,
      });
      request['payload'] = payload;
    } catch {
      throw new UnauthorizedException('Error sin autorización.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
