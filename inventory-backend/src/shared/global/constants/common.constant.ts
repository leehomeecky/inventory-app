export const DEFAULT_LIMIT = 50;
export const MAX_IMAGE_FILE_SIZE = 100000000;
export const DEFAULT_STORAGE_NAME = 'defaultStorage';
export const getBearerToken = (token: string) => `Bearer ${token}`;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpg',
  'image/png',
  'image/jpeg',
  'image/webp',
];

export const STORAGE_FOLDER = {
  PRODUCT: 'inventory images/products',
};
