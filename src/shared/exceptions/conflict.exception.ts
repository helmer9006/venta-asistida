import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ProblemDetails } from '../models/problem-details.model';

export class ConflictException extends HttpException {
  private readonly logger = new Logger(ConflictException.name);
  constructor(problemDetails: ProblemDetails) {
    super(problemDetails, HttpStatus.CONFLICT.valueOf(), {
      cause: new Error(problemDetails.error),
    });
    this.logger.warn(problemDetails);
  }
}
