import { config } from 'dotenv';

config();
export const {
  BASE_URL,
  DB_CONFIG_TYPE,

  //============== | cloudinary env variables ======================
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,

  //============== | s3 env variables ======================
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;
