import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { CronjobService } from './cronjob.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CronjobService],
  exports: [CronjobService],
})
export class CronjobModule {}
