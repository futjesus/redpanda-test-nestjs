import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import * as path from 'path';

import { Configuration } from './config.keys';

const schemaConfig = Joi.object()
  .keys({
    [Configuration.PORT]: Joi.string().required(),
    [Configuration.KAFKA_BROKER]: Joi.string().required(),
  })
  .unknown();

type EnvType = { [key in keyof typeof Configuration]: string };

@Injectable()
class ConfigService {
  private isDevelopmentEnviroment: boolean;
  private readonly envConfig: EnvType;

  constructor() {
    this.isDevelopmentEnviroment = process.env.NODE_ENV !== 'production';

    if (this.isDevelopmentEnviroment) {
      const envFilePath = path.join(__dirname, '../../../../.env');
      const exitsPath = fs.existsSync(envFilePath);

      if (!exitsPath) {
        console.log('.env file does not exists');
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfig = process.env as EnvType;
    }

    const validateSchema = schemaConfig.validate(this.envConfig, {
      abortEarly: false,
    });

    if (validateSchema.error) {
      console.log(validateSchema.error.details?.map(({ message }) => message));
      process.exit(0);
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getCurrentEnv(): boolean {
    return this.isDevelopmentEnviroment;
  }
}

export { ConfigService };
