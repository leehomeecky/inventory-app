import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import {
  StoreRepository,
  ProductRepository,
} from 'src/shared/global/model/repositories';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository, ProductRepository],
})
export class StoreModule {}
