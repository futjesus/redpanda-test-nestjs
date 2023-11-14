import { Provider } from '@nestjs/common';

import { QueueAdapter } from '../adapters/out/queue';

import { ConsumptionPort } from '../ports/in';

import { ConsumptionApplication } from './consumption.application';
import { ConfigService } from 'src/modules/shared';

interface Type<T> {
  new (...args: any[]): T;
}

type ApplicationClassType = ConsumptionApplication;

const InjectBuilderAdapters = [ConfigService, QueueAdapter];

const useFactoryBuilder =
  (ApplicationClass: Type<ApplicationClassType>) =>
  (config: ConfigService, queueAdapter: QueueAdapter) => {
    return new ApplicationClass({
      config,
      queueAdapter,
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
