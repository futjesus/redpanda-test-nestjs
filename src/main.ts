import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService, Configuration } from './modules/shared';
// import { KafkaDecoratorProcessorService } from './modules/shared/queue/queue.service';
// import { QueueController } from './modules/shared/queue/queue.controller';

process.env.TZ = 'America/Toronto';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get<ConfigService>(ConfigService);
  const clientId = configService.get(Configuration.KAFKA_NAME_SERVICE);
  const groupId = configService.get(Configuration.KAFKA_NAME_CONSUMER);
  const brokers = configService.get(Configuration.KAFKA_BROKER).split(',');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers,
      },
      consumer: {
        groupId: `${groupId}-${process.pid}`,
        allowAutoTopicCreation: true,
      },
    },
  });

  // app
  //   .get(KafkaDecoratorProcessorService)
  //   .processKafkaDecorators([QueueController]);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.startAllMicroservices();
  await app.listen(AppModule.port).then(() =>
    console.info('info', `Server running on port: ${AppModule.port}`, {
      start: new Date(),
    }),
  );
};

bootstrap();
