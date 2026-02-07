import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import {
  Country,
  Currency,
  Product,
  State,
  Store,
} from 'src/shared/global/model/entities';

config();

@Injectable()
export class DbService {
  public static getDbConfigData() {
    const {
      DB_SSL,
      DB_PORT,
      DB_SYNC,
      DB_HOST: host,
      DB_NAME: database,
      DB_USER: username,
      DB_PASSWORD: password,
      DB_ENDPOINT_ID: ENDPOINT_ID,
    } = process.env;

    const dbConfig = {
      host,
      password,
      username,
      database,
      port: +DB_PORT,
      logging: false,
      type: 'postgres',
      entities: [Store, State, Country, Currency, Product],
      options: { encrypt: false },
      synchronize: DB_SYNC === 'true' || false,
      debug: process.env.ALLOW_TYPEORM_DEBUG === 'true',
    };

    if (DB_SSL && DB_SSL === 'true') {
      dbConfig['ssl'] = true;
      dbConfig['extra'] = { ssl: { rejectUnauthorized: false } };
      dbConfig['connection'] = { options: `project=${ENDPOINT_ID}` };
    }

    return dbConfig as TypeOrmModuleOptions;
  }
}
