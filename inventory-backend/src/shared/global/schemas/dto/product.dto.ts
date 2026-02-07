import {
  createProductSchema,
  productFilterSchema,
  updateProductSchema,
} from '../../../global';
import { createZodDto } from 'nestjs-zod';

export class ProductFilterDto extends createZodDto(productFilterSchema) {}
export class UpdateProductDto extends createZodDto(updateProductSchema) {
  imageFile?: Express.Multer.File;
}
export class CreateProductDto extends createZodDto(createProductSchema) {
  imageFile?: Express.Multer.File;
}
