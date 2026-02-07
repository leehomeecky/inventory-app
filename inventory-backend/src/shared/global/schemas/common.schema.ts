import moment from 'moment';
import z from 'zod';

export const stringToInt = z.string().transform((value, ctx) => {
  const parsedValue = parseInt(value);
  if (isNaN(parsedValue)) {
    ctx.addIssue({
      code: 'custom',
      message: 'must be a valid number',
    });
  }
  return parsedValue;
});

export const stringToFloat = z.string().transform((value, ctx) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    ctx.addIssue({
      code: 'custom',
      message: 'must be a valid number',
    });
  }
  return parsedValue;
});

export const stringToDate = z.string().transform((value, ctx) => {
  const date = moment(value);
  if (!date.isValid()) {
    ctx.addIssue({
      code: 'custom',
      message: 'must be a valid date string',
    });
  }
  return date.toDate();
});

export const futureDate = stringToDate.refine(
  (date) => moment(date).isSameOrAfter(moment(), 'day'),
  {
    message: 'must be greater or equals to today',
  },
);

export const pastDate = stringToDate.refine(
  (date) => moment(date).isSameOrBefore(moment(), 'day'),
  {
    message: 'date must be lesser or equals to today',
  },
);

//===================================================================================
//================================= | Common Schemas |=========================================
//===================================================================================

export const getByIdSchema = z.object({
  id: stringToInt,
});

export const filterSchema = z.object({
  search: z.string().optional(),
  limit: z.number().or(stringToInt).optional(),
  offset: z.number().or(stringToInt).optional(),
  endDate: stringToDate.and(pastDate).optional(),
  startDate: stringToDate.and(pastDate).optional(),
});
