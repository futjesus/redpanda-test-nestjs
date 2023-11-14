import { Module } from '@nestjs/common';

import { ApplicationConfig } from './application';
import { AdapterQueueConfig } from './adapters';
import { AdapterQueuePortConfig } from './adapters/out/queue';

@Module({
  providers: [
    ...ApplicationConfig,
    ...AdapterQueuePortConfig,
    ...AdapterQueueConfig,
  ],
})
export class LoaderModule {}
