import { Provider } from '@nestjs/common';

import { QueueAdapter } from '../adapters/out/queue';

import { ConsumptionPort } from '../ports/in';

import { ConsumptionApplication } from './consumption.application';
import { ConfigService } from 'src/modules/shared';
import { CronjobAdapter } from '../adapters/out/cronjob';
import { SocketAdapter } from '../adapters/out/socket';
import { MemoryDatabaseAdapter } from '../adapters/out/database';

interface Type<T> {
  new (...args: any[]): T;
}

type ApplicationClassType = ConsumptionApplication;

const InjectBuilderAdapters = [
  ConfigService,
  SocketAdapter,
  QueueAdapter,
  CronjobAdapter,
  MemoryDatabaseAdapter,
];

function useFactoryBuilder(ApplicationClass: Type<ApplicationClassType>) {
  return function (
    config: ConfigService,
    socketAdapter: SocketAdapter,
    queueAdapter: QueueAdapter,
    cronjobAdapter: CronjobAdapter,
    memoryDatabaseAdapter: MemoryDatabaseAdapter,
  ) {
    return new ApplicationClass({
      config,
      socketAdapter,
      queueAdapter,
      cronjobAdapter,
      memoryDatabaseAdapter,
    });
  };
}

const ApplicationConfig: Provider[] = [
  {
    provide: ConsumptionPort,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(ConsumptionApplication),
  },
];

export { ApplicationConfig };
