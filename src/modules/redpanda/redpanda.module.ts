import { Module } from '@nestjs/common';

import { ApplicationConfig } from './application';
import { AdapterConfig } from './adapters/out/adapters';

@Module({
  providers: [...AdapterConfig, ...ApplicationConfig],
})
export class RedpandaModule {}
