import { HttpStatus, Logger } from '@nestjs/common';
import { GenericResponse } from '@shared/models/generic-response.model';
export class GenericResponseTestDataBuilder {
  private genericResponse: GenericResponse;
  private readonly logger = new Logger();
  data: any;
  statusCode: number;
  message: string;

  constructor() {
    this.data = {};
    this.statusCode = 0;
    this.message = '';
  }

  public build(data, statusCode, message): GenericResponse {
    if (statusCode >= 500) this.logger.error(message);
    return new GenericResponse(data, statusCode, message);
  }
}
