import { z } from 'zod';
import { stringToInt } from './common.schema';

export const countryIdValidationSchema = z.object({
  countryCode: z.string().min(2).max(3),
});

export const stateIdValidationSchema = z.object({
  stateId: stringToInt.or(z.number()),
});

export const currencyIdValidationSchema = z.object({
  currencyId: z.string().min(2).max(3),
});
