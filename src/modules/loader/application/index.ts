import { Provider } from '@nestjs/common';

import { QueueAdapter } from '../adapters/out/queue';

import { ConsumptionPort } from '../ports/in';

import { ConsumptionApplication } from './consumption.application';

interface Type<T> {
  new (...args: any[]): T;
}

type ApplicationClassType = ConsumptionApplication;

const InjectBuilderAdapters = [QueueAdapter];

const useFactoryBuilder =
  (ApplicationClass: Type<ApplicationClassType>) =>
  (queueAdapter: QueueAdapter) => {
    return new ApplicationClass({
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
