import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { GenericResponse } from '@src/shared/models/generic-response.model';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as Users;
  if (!user) throw new GenericResponse({}, 500, 'Usuario no encontrado.');
  return !data ? user : user[data];
});
