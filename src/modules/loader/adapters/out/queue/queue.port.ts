import { Provider } from '@nestjs/common';

import {
  QueueConsumerPort,
  QueueProducePort,
} from 'src/modules/loader/ports/out';
import {
  KafkaConsumerService,
  KafkaProducerService,
} from 'src/modules/shared/kafka';

export const AdapterQueuePortConfig: Provider[] = [
  {
    provide: QueueProducePort,
    useExisting: KafkaProducerService,
  },
  {
    provide: QueueConsumerPort,
    useExisting: KafkaConsumerService,
  },
];
