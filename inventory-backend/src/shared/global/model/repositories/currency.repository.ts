import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { DataSource } from 'typeorm';
import { Currency } from '../entities';

@Injectable()
export class CurrencyRepository extends AbstractRepository<Currency> {
  constructor(private dataSource: DataSource) {
    super(Currency, dataSource);
  }
}
