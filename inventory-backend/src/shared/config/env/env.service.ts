import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class EnvService {
  public static validationSchema() {
    const schema = Joi.object({
      //============ | db env var | ==============
      DB_PORT: Joi.number().required(),
      DB_NAME: Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_SSL: Joi.boolean().default(true),
      DB_PASSWORD: Joi.string().required(),
      DB_SYNC: Joi.boolean().default(false),

      //============ | storage env var | ==============
      DEFAULT_STORAGE: Joi.string().valid('cloudinary', 's3').required(),

      //============ | cloudinary env var | ==============

      CLOUDINARY_CLOUD_NAME: Joi.string().when('DEFAULT_STORAGE', {
        is: 'cloudinary',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      CLOUDINARY_API_KEY: Joi.string().when('DEFAULT_STORAGE', {
        is: 'cloudinary',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      CLOUDINARY_API_SECRET: Joi.string().when('DEFAULT_STORAGE', {
        is: 'cloudinary',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),

      //============ | S3 env var | ==============

      AWS_REGION: Joi.string().when('DEFAULT_STORAGE', {
        is: 's3',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      AWS_S3_BUCKET: Joi.string().when('DEFAULT_STORAGE', {
        is: 's3',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      AWS_ACCESS_KEY_ID: Joi.string().when('DEFAULT_STORAGE', {
        is: 's3',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      AWS_SECRET_ACCESS_KEY: Joi.string().when('DEFAULT_STORAGE', {
        is: 's3',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),

      //============ | app env var | ==============
      PORT: Joi.number().default(3000),
      NODE_ENV: Joi.string()
        .valid('dev', 'prod', 'test', 'stage')
        .default('dev'),
    });

    return schema;
  }
}
