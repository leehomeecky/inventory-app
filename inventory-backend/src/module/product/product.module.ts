import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {
  ProductRepository,
  StoreRepository,
  CurrencyRepository,
} from 'src/shared/global/model/repositories';
import { StorageModule } from 'src/shared/config/storage/storage.module';

@Module({
  imports: [StorageModule.register()],
  controllers: [ProductController],
  providers: [
    ProductService,
    StoreRepository,
    ProductRepository,
    CurrencyRepository,
  ],
})
export class ProductModule {}
