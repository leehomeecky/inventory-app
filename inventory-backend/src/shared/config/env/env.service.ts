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
      DB_SSL: Joi.boolean().default(false),
      DB_PASSWORD: Joi.string().required(),
      DB_SYNC: Joi.boolean().default(true),

      //============ | app env var | ==============
      PORT: Joi.number().default(3000),
      NODE_ENV: Joi.string()
        .valid('dev', 'prod', 'test', 'stage')
        .default('dev'),
    });

    return schema;
  }
}
