import { Module } from '@nestjs/common';

import {
  Configuration,
  ConfigModule,
  ConfigService,
  KafkaModule,
  SocketModule,
  CronjobModule,
} from './modules/shared';

import { LoaderModule } from './modules/loader';

@Module({
  imports: [
    ConfigModule,
    CronjobModule,
    SocketModule,
    KafkaModule,
    LoaderModule,
  ],
})
export class AppModule {
  static port: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = Number(this.configService.get(Configuration.PORT));
  }
}
