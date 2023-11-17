import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

process.env.TZ = 'America/Toronto';
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  app.use(helmet());

  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(AppModule.port).then(() => {
    const logger = new Logger('StartApplicstion');

    logger.log(`Server running on port: ${AppModule.port} at ${new Date()}`);
  });
};

bootstrap();
