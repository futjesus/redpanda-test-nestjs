import { Module } from '@nestjs/common';

import { ApplicationConfig } from './application';
import { AdapterQueueConfig } from './adapters';

@Module({
  providers: [...AdapterQueueConfig, ...ApplicationConfig],
})
export class LoaderModule {}
