import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';

@Module({
  imports: [TypeOrmModule.forRoot(DbService.getDbConfigData())],
})
export class DbModule {}
