import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorMessage } from '../global';

export const outputError = (err: {
  error: unknown;
  message?: string;
}): void => {
  const { error, message } = err;
  if (error instanceof HttpException) {
    throw error;
  }
  Logger.log(error);
  console.log(error);
  throw new InternalServerErrorException(
    null,
    message ?? ErrorMessage.INTERNAL_SERVER_ERROR,
  );
};
