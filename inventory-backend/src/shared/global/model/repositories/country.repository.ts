import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { DataSource } from 'typeorm';
import { Country } from '../entities';

@Injectable()
export class CountryRepository extends AbstractRepository<Country> {
  constructor(private dataSource: DataSource) {
    super(Country, dataSource);
  }
}
