import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { DEFAULT_STORAGE_NAME, StorageNameEnum } from 'src/shared/global';
import { CloudinaryUtil, S3Util } from 'src/shared/util';

config();

@Injectable()
export class StorageService {
  static storage(data: { name?: string; storageName: StorageNameEnum }[]) {
    const { DEFAULT_STORAGE } = process.env;
    const storages = {
      s3: S3Util,
      cloudinary: CloudinaryUtil,
    };
    const storageProvider = [];

    if (DEFAULT_STORAGE)
      storageProvider.push({
        provide: DEFAULT_STORAGE_NAME,
        useClass: storages[DEFAULT_STORAGE],
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
