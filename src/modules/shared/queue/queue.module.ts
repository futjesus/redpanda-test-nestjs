import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigService, Configuration } from '../config';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDPANDA_SERVICE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'redpanda',
              brokers: [configService.get(Configuration.KAFKA_BROKER)],
            },
            consumer: {
              groupId: 'redpanda-consumer-' + process.pid,
            },
          },
        }),
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
