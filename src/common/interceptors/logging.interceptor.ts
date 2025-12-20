import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggingService } from '../../logging/logging.service';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();

    try {
      this.loggingService.logRequest({
        url: request.url,
        method: request.method,
        query: request.query || {},
        body: request.body || {},
      });
    } catch {
      // Ignore logging errors
    }

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const responseTime = Date.now() - startTime;

        try {
          this.loggingService.logResponse(
            { url: request.url, method: request.method },
            response.statusCode,
            responseTime,
          );
        } catch {
          // Ignore logging errors
        }
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        try {
          this.loggingService.logResponse(
            { url: request.url, method: request.method },
            error.status || 500,
            responseTime,
          );
        } catch {
          // Ignore logging errors
        }
        return throwError(() => error);
      }),
    );
  }
}
