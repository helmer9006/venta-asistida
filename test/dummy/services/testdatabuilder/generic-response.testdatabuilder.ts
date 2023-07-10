import { HttpStatus } from '@nestjs/common';
import { GenericResponse } from '@shared/models/generic-response.model';
export class GenericResponseTestDataBuilder {
  private genericResponse: GenericResponse;
  data: any;
  statusCode: number;
  message: string;

  constructor() {
    this.data = {};
    this.statusCode = HttpStatus.OK;
    this.message = 'OK';
  }

  public build(): GenericResponse {
    return new GenericResponse(this.data, this.statusCode, this.message);
  }
}
