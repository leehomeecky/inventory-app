export type stringOrNumber = string | number;

export interface UploadedFileData {
  assetUrl: string;
  assetId: string;
}

export interface SerializedBuffer {
  type: 'Buffer';
  data: number[];
}
