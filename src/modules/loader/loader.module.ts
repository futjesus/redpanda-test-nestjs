import { Module } from '@nestjs/common';

import { ApplicationConfig } from './application';
import {
  AdapterCronjobConfig,
  AdapterDatabaseConfig,
  AdapterQueueConfig,
  AdapterSocketConfig,
} from './adapters';

@Module({
  providers: [
    ...AdapterCronjobConfig,
    ...AdapterDatabaseConfig,
    ...AdapterQueueConfig,
    ...AdapterSocketConfig,
    ...ApplicationConfig,
  ],
})
export class LoaderModule {}
