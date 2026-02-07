import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const message = exception.message;
    const statusCode = exception.getStatus();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    response.status(statusCode).json({
      message,
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

export const httpExceptionFilter = new HttpExceptionFilter();
