import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { Configuration, ConfigService } from '../config';
import { MemoryRepository } from './repositories';
import { MemoryConsumptionEntity } from './entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: config.get(Configuration.POSTGRESQL_HOST),
        port: +config.get(Configuration.POSTGRESQL_PORT),
        username: config.get(Configuration.POSTGRESQL_USERNAME),
        password: config.get(Configuration.POSTGRESQL_PASSWORD),
        database: config.get(Configuration.POSTGRESQL_DATABASE),
        migrationsTableName: 'typeorm_migrations',
        migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
        logging: config.getCurrentEnv(),
        migrationsRun: config.getCurrentEnv(),
        entities: [MemoryConsumptionEntity],
      }),
    }),
    TypeOrmModule.forFeature([MemoryConsumptionEntity]),
  ],
  providers: [MemoryRepository],
  exports: [MemoryRepository],
})
class DatabaseModule {}

export { DatabaseModule };
