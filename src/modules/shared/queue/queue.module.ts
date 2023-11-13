import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigModule, ConfigService, Configuration } from '../config';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const clientId = configService.get(Configuration.KAFKA_NAME_SERVICE);
          const groupId = configService.get(Configuration.KAFKA_NAME_CONSUMER);
          const brokers = configService
            .get(Configuration.KAFKA_BROKER)
            .split(',');

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId,
                brokers,
              },
              consumer: {
                groupId: `${groupId}-${process.pid}`,
              },
              subscribe: {
                fromBeginning: true,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [QueueController],
})
export class QueueModule {}
