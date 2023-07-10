import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap({
        next: (val) => {
          setTimeout(() => {
            this.logger.log(
              `\n HTTP  ${request.path} ${request.method} ${
                response.statusCode
              } \n ${JSON.stringify(request.headers)} \n ${JSON.stringify(
                val,
              )}`,
            );
          }, 0);
        },
        error: (error) => {
          setTimeout(() => {
            this.logger.warn(
              `\n HTTP  ${request.path} ${request.method} ${
                response.statusCode
              } \n ${JSON.stringify(request.headers)} \n ${error}`,
            );
          }, 0);
        },
      }),
    );
  }
}
