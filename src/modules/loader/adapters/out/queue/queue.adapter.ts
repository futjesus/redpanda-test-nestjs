import { QueuePort } from 'src/modules/loader/ports/out';
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

  async listenTestMessage(): Promise<void> {
    const groupId = this.config.get(Configuration.KAFKA_NAME_CONSUMER);
    const topic = this.config.get(Configuration.MEMORY_TOPIC);

    await this.kafkaConsumer.consume({
      topic: {
        topics: [topic],
        fromBeginning: true,
      },
      config: { groupId: `${groupId}-${process.pid}` },
      onMessage: (message: Record<string, string>) => {
        console.log(message);
      },
    });
  }

  async publishMessage<T>(topic: string, message: T): Promise<void> {
    this.kafkaProduce.produce(topic, {
      key: String(process.pid),
      value: JSON.stringify({
        ...message,
        timeStamp: new Date().toISOString(),
      }),
    });
  }
}
