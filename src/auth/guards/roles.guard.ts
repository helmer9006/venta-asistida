import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesEnum } from '../enums/roles.enum';
import { Payload } from '../models/payload.model';
import { UnauthorizedException } from 'src/shared/exceptions/unauthorized.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<RolesEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as Payload;
    const isAuth = roles.some((role) => role === user.role);
    if (!isAuth) {
      throw new UnauthorizedException(
        'No tienes roles necesarios para acceder al recurso.',
      );
    }
    return isAuth;
  }
}
