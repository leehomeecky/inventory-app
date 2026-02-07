import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
} from 'src/shared/global/schemas/dto';
import {
  createProductSchema,
  updateProductSchema,
} from 'src/shared/global/schemas/product.schema';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE,
  SuccessMessageEnum,
} from 'src/shared/global';
import { acceptFileTypes } from 'src/shared/util';
import { fileSchema } from 'src/shared/global/schemas/file.schema';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: acceptFileTypes(ACCEPTED_IMAGE_TYPES),
    }),
  )
  async create(
    @Req() req: Request<null, null, CreateProductDto>,
    @Res({ passthrough: true }) resp: Response,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    try {
      if (imageFile) {
        fileSchema(
          {
            acceptedMimetype: ACCEPTED_IMAGE_TYPES,
            maxFileSize: MAX_IMAGE_FILE_SIZE,
          },
          imageFile,
        );
      }
      createProductSchema.parse(req.body);
    } catch (error) {
      throw new ZodValidationException(error);
    }
    const payload = { ...req.body, imageFile };
    await this.productService.create(payload);
    resp.json({
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Get()
  async findAll(@Query() filters: ProductFilterDto) {
    return this.productService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: acceptFileTypes(ACCEPTED_IMAGE_TYPES),
    }),
  )
  async update(
    @Param('id') id: number,
    @Req() req: Request<null, null, UpdateProductDto>,
    @Res({ passthrough: true }) resp: Response,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    try {
      if (imageFile) {
        fileSchema(
          {
            acceptedMimetype: ACCEPTED_IMAGE_TYPES,
            maxFileSize: MAX_IMAGE_FILE_SIZE,
          },
          imageFile,
        );
      }
      updateProductSchema.parse(req.body);
    } catch (error) {
      throw new ZodValidationException(error);
    }
    const payload = { ...req.body, imageFile };
    await this.productService.update(id, payload);
    resp.json({
      message: SuccessMessageEnum.CONTROLLER_MESSAGE,
      code: 0,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
