import { Module } from '@nestjs/common';

import { ApplicationConfig } from './application';
import {
  AdapterCronjobConfig,
  AdapterQueueConfig,
  AdapterSocketConfig,
} from './adapters';

@Module({
  providers: [
    ...AdapterQueueConfig,
    ...AdapterSocketConfig,
    ...AdapterCronjobConfig,
    ...ApplicationConfig,
  ],
})
export class LoaderModule {}
