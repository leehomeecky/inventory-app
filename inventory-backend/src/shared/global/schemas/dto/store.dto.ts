import { createZodDto } from 'nestjs-zod';
import { createStoreSchema, updateStoreSchema } from '../store.schema';

export class CreateStoreDto extends createZodDto(createStoreSchema) {}
export class UpdateStoreDto extends createZodDto(updateStoreSchema) {}
