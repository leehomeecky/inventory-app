import { UploadedFileData } from '../types';

export interface IStorage {
  uploadFile(
    folder?: string,
    ...files: Express.Multer.File[]
  ): UploadedFileData[] | Promise<UploadedFileData[]>;

  deleteFile(...data: UploadedFileData[] | string[]);
}
