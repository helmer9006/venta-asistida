import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class BadRequestException extends HttpException {
  private readonly logger = new Logger(BadRequestException.name);
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST.valueOf());
    this.logger.warn(message);
  }
}
