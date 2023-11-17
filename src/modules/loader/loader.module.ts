import { Module } from '@nestjs/common';

import { ApplicationConfig } from './application';
import { AdapterCronjobConfig, AdapterQueueConfig } from './adapters';

@Module({
  providers: [
    ...AdapterQueueConfig,
    ...AdapterCronjobConfig,
    ...ApplicationConfig,
  ],
})
export class LoaderModule {}
