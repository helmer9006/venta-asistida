import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isEmail(value)) {
      throw new BadRequestException(
        'El parámetro no es una dirección de correo electrónico válida',
      );
    }
    return value;
  }
}
