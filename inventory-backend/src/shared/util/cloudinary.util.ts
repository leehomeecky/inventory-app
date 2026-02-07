import * as streamifier from 'streamifier';
import {
  ConfigOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

import { Injectable } from '@nestjs/common';
import { outputError } from './error.util';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  IStorage,
  SerializedBuffer,
  UploadedFileData,
} from '../global';

@Injectable()
export class CloudinaryUtil implements IStorage {
  private readonly api_key = CLOUDINARY_API_KEY;
  private readonly api_secret = CLOUDINARY_API_SECRET;
  private readonly cloud_name = CLOUDINARY_CLOUD_NAME;
  private static _config: ConfigOptions | null = null;

  constructor() {
    if (!CloudinaryUtil._config)
      CloudinaryUtil._config = cloudinary.config({
        api_key: this.api_key,
        api_secret: this.api_secret,
        cloud_name: this.cloud_name,
      });
  }

  async uploadFile(folder?: string, ...files: Express.Multer.File[]) {
    try {
      const uploadFilePromise = files.map((file) => {
        if (!Buffer.isBuffer(file.buffer))
          file.buffer = Buffer.from((file.buffer as SerializedBuffer).data);
        return this.uploadFileToCloud({ fileBuffer: file.buffer, folder });
      });

      const uploadFile = await Promise.all(uploadFilePromise);

      const uploadFileResult: UploadedFileData[] = uploadFile.map((val) => ({
        assetUrl: val.secure_url,
        assetId: val.public_id,
      }));

      return uploadFileResult;
    } catch (error) {
      outputError(error);
    }
  }

  private async uploadFileToCloud(data: {
    fileBuffer: Buffer;
    folder?: string;
  }) {
    const { fileBuffer, folder } = data;
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      },
    );
  }

  async deleteFile(...data: UploadedFileData[] | string[]) {
    const deletePromise = data.map((val) =>
      cloudinary.uploader.destroy(val?.assetId ?? val, { invalidate: true }),
    );

    return Promise.all(deletePromise);
  }
}
