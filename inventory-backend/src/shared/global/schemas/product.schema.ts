import { z } from 'zod';
import { filterSchema, stringToInt } from './common.schema';

export const createProductSchema = z.object({
  price: stringToInt,
  currencyId: z.string().min(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(100),
  storeId: stringToInt.pipe(z.number().positive()),
  quantity: stringToInt.pipe(z.number().positive()),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = filterSchema.extend({
  category: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  storeId: stringToInt.pipe(z.number().positive()).optional(),
  minQuantity: z.coerce.number().int().nonnegative().optional(),
  maxQuantity: z.coerce.number().int().nonnegative().optional(),
});
