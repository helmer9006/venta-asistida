import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ProblemDetails } from '../models/problem-details.model';

export class ServiceUnavailableException extends HttpException {
  private readonly logger = new Logger(ServiceUnavailableException.name);
  constructor(problemDetails: ProblemDetails) {
    super(problemDetails, HttpStatus.SERVICE_UNAVAILABLE.valueOf(), {
      cause: new Error(problemDetails.error),
    });
    this.logger.warn(problemDetails);
  }
}
