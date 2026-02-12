import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { DEFAULT_STORAGE_NAME, StorageNameEnum } from 'src/shared/global';
import { LocalFileUtil } from 'src/shared/util';

config();

@Injectable()
export class StorageService {
  static storage(data: { name?: string; storageName: StorageNameEnum }[]) {
    const storages = {
      local: LocalFileUtil,
    };
    const storageProvider = [];

    storageProvider.push({
      provide: DEFAULT_STORAGE_NAME,
      useClass: LocalFileUtil,
    });

    if (data?.length)
      data.forEach(({ name, storageName }) =>
        storageProvider.push({
          provide: name ?? storageName,
          useClass: storages[storageName],
        }),
      );

    return storageProvider;
  }
}
