import { HttpStatus } from '@nestjs/common';
import { GenericResponse } from '@shared/models/generic-response.model';
export class GenericResponseTestDataBuilder {
  private genericResponse: GenericResponse;
  data: any;
  statusCode: number;
  message: string;

  constructor() {
    this.data = {};
    this.statusCode = 0;
    this.message = '';
  }

  public build(data, statusCode, message): GenericResponse {
    return new GenericResponse(data, statusCode, message);
  }
}
