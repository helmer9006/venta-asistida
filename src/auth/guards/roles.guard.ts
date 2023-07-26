import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesEnum } from '../enums/roles.enum';
import { Users } from '@prisma/client';
import { GenericResponse } from '@src/shared/models/generic-response.model';

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
    if (roles.length == 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as Users;
    const isAuth = roles.some((role) => role === user.roleId);
    if (!isAuth) {
      throw new GenericResponse(
        {},
        401,
        'No tiene rol necesario para acceder al recurso.',
      );
    }
    return isAuth;
  }
}
