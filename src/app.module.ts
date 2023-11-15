import { Module } from '@nestjs/common';

import {
  Configuration,
  ConfigModule,
  ConfigService,
  KafkaModule,
  SocketModule,
} from './modules/shared';

import { LoaderModule } from './modules/loader';

@Module({
  imports: [ConfigModule, SocketModule, KafkaModule, LoaderModule],
})
export class AppModule {
  static port: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = Number(this.configService.get(Configuration.PORT));
  }
}
