import { Module } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';
import { MiscellaneousController } from './miscellaneous.controller';
import {
  CountryRepository,
  CurrencyRepository,
  StateRepository,
  StoreRepository,
  ProductRepository,
} from '../../shared/global/model/repositories';

@Module({
  controllers: [MiscellaneousController],
  providers: [
    StateRepository,
    CountryRepository,
    CurrencyRepository,
    StoreRepository,
    ProductRepository,
    MiscellaneousService,
  ],
})
export class MiscellaneousModule {}
