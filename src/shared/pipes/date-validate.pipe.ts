import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { isDate } from 'class-validator';
import { GenericResponse } from '../models/generic-response.model';

@Injectable()
export class DateValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isDate(value)) {
      throw new GenericResponse(
        {},
        HttpStatus.BAD_REQUEST.valueOf(),
        `El valor "${value}" no es una fecha válida.`,
      );
    }
    return value;
  }
}
