import { HttpStatus } from '@nestjs/common';
import { GenericResponse } from '../models/generic-response.model';

export const isNumber = (term: any): boolean => {
  return term == Number(term);
};
export const handleExceptions = (error: any): never => {
  if (error.code === '23505')
    throw new GenericResponse(
      {},
      HttpStatus.CONFLICT.valueOf(),
      'Existe un registra con la misma información.',
    );
  if (error.code === 'P2002')
    throw new GenericResponse(
      {},
      HttpStatus.CONFLICT.valueOf(),
      'Existe un registro con la misma información.',
    );
  if (error.code === 'P1001')
    throw new GenericResponse(
      {},
      HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
      'Ha ocurrido un error de conexión con la base de datos.',
    );
  const msg = error.message ? error.message : 'Error interno del servidor';
  const status = error.status
    ? error.status
    : error.statusCode
    ? error.statusCode
    : 500;
  throw new GenericResponse({}, status, msg);
};
