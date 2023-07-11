import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ProblemDetails } from '../models/problem-details.model';

export class NotFoundException extends HttpException {
  private readonly logger = new Logger(NotFoundException.name);
  constructor(problemDetails: ProblemDetails) {
    super(problemDetails, HttpStatus.NOT_FOUND.valueOf(), {
      cause: new Error(problemDetails.error),
    });
    this.logger.log(problemDetails);
  }
}
