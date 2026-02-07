import { miscellaneousError } from './miscellaneous.error';

export const ErrorMessage = {
  ...miscellaneousError,
  INVALID_CREDENTIALS: 'Sorry invalid credentials',
  INTERNAL_SERVER_ERROR: 'Oops!! internal server error',
};
