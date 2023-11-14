import { Provider } from '@nestjs/common';

import { ConfigService } from 'src/modules/shared/config';
import {
  KafkaConsumerService,
  KafkaProducerService,
} from 'src/modules/shared/kafka';

import { QueueAdapter } from './queue.adapter';

type AdapterType = QueueAdapter;

interface Type<T> {
  new (...args: any[]): T;
}

const InjectBuilderAdapters = [
  ConfigService,
  KafkaProducerService,
  KafkaConsumerService,
];

const useFactoryBuilder =
  (AdapterClass: Type<AdapterType>) =>
  (
    config: ConfigService,
    kafkaProduce: KafkaProducerService,
    kafkaConsumer: KafkaConsumerService,
  ) => {
    return new AdapterClass({
      config,
      kafkaProduce,
      kafkaConsumer,
    });
  };

export const AdapterQueueConfig: Provider[] = [
  {
    provide: QueueAdapter,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(QueueAdapter),
  },
];
