import { HttpStatus, Logger } from '@nestjs/common';
import { GenericResponse } from '../models/generic-response.model';

export const isNumber = (term: any): boolean => {
  return term == Number(term);
};
