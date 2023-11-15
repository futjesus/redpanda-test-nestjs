import { v4 as uuid } from 'uuid';

import {
  MessageConsumerAction,
  MessageProducerAction,
  QueuePort,
} from 'src/modules/loader/ports/out';
import {
  ConfigService,
  Configuration,
  KafkaConsumerService,
  KafkaProducerService,
} from 'src/modules/shared';

export class QueueAdapter implements QueuePort {
  private config: ConfigService;
  private kafkaProduce: KafkaProducerService;
  private kafkaConsumer: KafkaConsumerService;

  constructor({ config, kafkaProduce, kafkaConsumer }) {
    this.config = config;
    this.kafkaProduce = kafkaProduce;
    this.kafkaConsumer = kafkaConsumer;
  }

  async listenTestMessage({
    topic,
    onMessage,
  }: MessageProducerAction): Promise<void> {
    const groupId = this.config.get(Configuration.KAFKA_NAME_CONSUMER);

    await this.kafkaConsumer.consume({
      topic: {
        topics: [topic],
        fromBeginning: true,
      },
      config: { groupId: `${groupId}-${process.pid}` },
      onMessage,
    });
  }

  async publishMessage<T>({
    topic,
    message,
  }: MessageConsumerAction<T>): Promise<void> {
    this.kafkaProduce.produce(topic, {
      key: String(process.pid),
      value: JSON.stringify({
        id: uuid(),
        ...message,
        timeStamp: new Date().toISOString(),
      }),
    });
  }
}
