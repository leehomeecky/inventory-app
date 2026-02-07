import { Injectable } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  IStorage,
  UploadedFileData,
  SerializedBuffer,
} from '../global';
import { outputError } from './error.util';

@Injectable()
export class S3Util implements IStorage {
  private readonly bucket = AWS_S3_BUCKET;

  private readonly s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(folder?: string, ...files: Express.Multer.File[]) {
    try {
      const uploads = files.map(async (file) => {
        if (!Buffer.isBuffer(file.buffer)) {
          file.buffer = Buffer.from((file.buffer as SerializedBuffer).data);
        }

        const key = this.buildKey(file.originalname, folder);

        const upload = new Upload({
          client: this.s3,
          params: {
            Key: key,
            Body: file.buffer,
            Bucket: this.bucket,
            ContentType: file.mimetype,
          },
        });

        await upload.done();

        return {
          assetId: key,
          assetUrl: this.getPublicUrl(key),
        } as UploadedFileData;
      });

      return await Promise.all(uploads);
    } catch (error) {
      outputError(error);
    }
  }

  async deleteFile(...data: UploadedFileData[] | string[]) {
    const deletes = data.map((val) => {
      const key = typeof val === 'string' ? val : val.assetId;

      return this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    });

    return Promise.all(deletes);
  }

  /* ----------------- helpers ----------------- */

  private buildKey(filename: string, folder?: string) {
    const timestamp = Date.now();
    return folder
      ? `${folder}/${timestamp}-${filename}`
      : `${timestamp}-${filename}`;
  }

  private getPublicUrl(key: string) {
    return `https://${this.bucket}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  }
}
