import { z } from 'zod';

export const createStoreSchema = z.object({
  location: z.string().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const updateStoreSchema = createStoreSchema.partial();
