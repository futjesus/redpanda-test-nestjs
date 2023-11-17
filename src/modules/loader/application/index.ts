import { Provider } from '@nestjs/common';

import { QueueAdapter } from '../adapters/out/queue';

import { ConsumptionPort } from '../ports/in';

import { ConsumptionApplication } from './consumption.application';
import { ConfigService } from 'src/modules/shared';
import { CronjobAdapter } from '../adapters/out/cronjob';

interface Type<T> {
  new (...args: any[]): T;
}

type ApplicationClassType = ConsumptionApplication;

const InjectBuilderAdapters = [ConfigService, QueueAdapter, CronjobAdapter];

const useFactoryBuilder =
  (ApplicationClass: Type<ApplicationClassType>) =>
  (
    config: ConfigService,
    queueAdapter: QueueAdapter,
    cronjobAdapter: CronjobAdapter,
  ) => {
    return new ApplicationClass({
      config,
      queueAdapter,
      cronjobAdapter,
    });
  };

const ApplicationConfig: Provider[] = [
  {
    provide: ConsumptionPort,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(ConsumptionApplication),
  },
];

export { ApplicationConfig };
