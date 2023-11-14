import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '../config';

import { KafkaProducerService } from './producer';
import { KafkaConsumerService } from './consumer';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
