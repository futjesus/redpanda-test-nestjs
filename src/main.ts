import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

process.env.TZ = 'America/Toronto';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(AppModule.port).then(() =>
    console.info('info', `Server running on port: ${AppModule.port}`, {
      start: new Date(),
    }),
  );
};

bootstrap();
