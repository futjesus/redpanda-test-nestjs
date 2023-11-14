import { Provider } from '@nestjs/common';

import { QueueConsumerPort, QueueProducePort } from '../../../ports/out';

import { QueueAdapter } from './queue.adapter';

type AdapterType = QueueAdapter;

interface Type<T> {
  new (...args: any[]): T;
}

const InjectBuilderAdapters = [QueueProducePort, QueueConsumerPort];

const useFactoryBuilder =
  (AdapterClass: Type<AdapterType>) =>
  (
    queueProducePort: QueueProducePort,
    queueConsumerPort: QueueConsumerPort,
  ) => {
    return new AdapterClass({
      queueProducePort,
      queueConsumerPort,
    });
  };

export const AdapterQueueConfig: Provider[] = [
  {
    provide: QueueAdapter,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(QueueAdapter),
  },
];
