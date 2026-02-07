import {
  countryIdValidationSchema,
  currencyIdValidationSchema,
  stateIdValidationSchema,
} from '../../../global';
import { createZodDto } from 'nestjs-zod';

export class GetStateDto extends createZodDto(stateIdValidationSchema) {}
export class GetCountryDto extends createZodDto(countryIdValidationSchema) {}
export class GetCurrencyDto extends createZodDto(currencyIdValidationSchema) {}
