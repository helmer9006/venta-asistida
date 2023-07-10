import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  private readonly logger = new Logger(UnauthorizedException.name);
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED.valueOf());
    this.logger.warn(message);
  }
}
