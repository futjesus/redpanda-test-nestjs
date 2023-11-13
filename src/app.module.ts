import { Module } from '@nestjs/common';

import {
  Configuration,
  ConfigModule,
  ConfigService,
  QueueModule,
} from './modules/shared';

import { RedpandaModule } from './modules/redpanda/redpanda.module';

@Module({
  imports: [ConfigModule, QueueModule, RedpandaModule],
})
export class AppModule {
  static port: number;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = Number(this._configService.get(Configuration.PORT));
  }
}
