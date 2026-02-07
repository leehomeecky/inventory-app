import { createZodDto } from 'nestjs-zod';
import { getByIdSchema } from '../common.schema';

export class GetByIdDto extends createZodDto(getByIdSchema) {}
