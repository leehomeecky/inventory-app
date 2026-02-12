import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { IStorage, UploadedFileData } from '../global';
import { outputError } from './error.util';

@Injectable()
export class LocalFileUtil implements IStorage {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = join(process.cwd(), 'uploads');
    this.ensureUploadDirectory();
  }

  async uploadFile(folder?: string, ...files: Express.Multer.File[]) {
    try {
      const uploadFileResult: UploadedFileData[] = [];

      for (const file of files) {
        const filePath = this.buildFilePath(file.originalname, folder);
        const fullPath = join(this.uploadDir, filePath);

        // Ensure directory exists
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }

        // Write file to disk
        writeFileSync(fullPath, file.buffer);

        // Return file path as assetUrl and filename as assetId
        uploadFileResult.push({
          assetUrl: `http://localhost:3000/uploads/${filePath}`,
          assetId: filePath,
        });
      }

      return uploadFileResult;
    } catch (error) {
      outputError(error);
      return [];
    }
  }

  async deleteFile(...data: UploadedFileData[] | string[]) {
    try {
      const deletePromises = data.map((val) => {
        const filePath = typeof val === 'string' ? val : val.assetId;
        const fullPath = join(this.uploadDir, filePath);

        if (existsSync(fullPath)) {
          unlinkSync(fullPath);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      return await Promise.all(deletePromises);
    } catch (error) {
      outputError(error);
      return [];
    }
  }

  private ensureUploadDirectory(): void {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private buildFilePath(filename: string, folder?: string): string {
    const timestamp = Date.now();
    const sanitizedFilename = this.sanitizeFilename(filename);

    if (folder) {
      return `${folder}/${timestamp}-${sanitizedFilename}`;
    }
    return `${timestamp}-${sanitizedFilename}`;
  }

  private sanitizeFilename(filename: string): string {
    // Remove any characters that might cause issues in file paths
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
}
