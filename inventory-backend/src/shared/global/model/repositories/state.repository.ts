import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { DataSource } from 'typeorm';
import { State } from '../entities';

@Injectable()
export class StateRepository extends AbstractRepository<State> {
  constructor(private dataSource: DataSource) {
    super(State, dataSource);
  }
}
