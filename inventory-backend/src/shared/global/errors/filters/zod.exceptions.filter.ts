import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus() ?? HttpStatus.BAD_REQUEST;

    const zodError = exception.getZodError() as ZodError;

    console.log({ zodError });
    const issue = zodError?.issues[0];
    const message = `${issue.code} error on ${issue.path}, ${issue.message}`;

    response.status(statusCode).json({
      message,
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
