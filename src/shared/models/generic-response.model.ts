import { Logger } from '@nestjs/common';
import { error } from 'console';

// Example entity for mapping data
const logger = new Logger('Generic Response');
export class GenericResponse {
  statusCode: number;
  message: string;
  data?: any;
  constructor(data: any, statusCode: number, message: string) {
    if (statusCode >= 500) {
      logger.error(message);
    }
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
