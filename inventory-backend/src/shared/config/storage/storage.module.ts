import { DynamicModule, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageNameEnum } from 'src/shared/global';

@Module({})
export class StorageModule {
  static register(
    data?: { name?: string; storageName: StorageNameEnum }[],
  ): DynamicModule {
    return {
      module: StorageModule,
      providers: [...StorageService.storage(data)],
      exports: [...StorageService.storage(data)],
    };
  }
}
