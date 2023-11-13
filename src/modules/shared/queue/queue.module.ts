import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { QueueController } from './queue.controller';

@Module({
  imports: [ConfigModule],
  controllers: [QueueController],
})
export class QueueModule {}
