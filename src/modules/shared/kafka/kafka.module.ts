import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';

import { KafkaProducerService } from './producer';
import { KafkaConsumerService } from './consumer';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [ConfigModule],
  controllers: [KafkaController],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
