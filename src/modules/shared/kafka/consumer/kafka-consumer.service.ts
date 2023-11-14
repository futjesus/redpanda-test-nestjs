import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';

import { ConfigService, Configuration } from '../../config';

import { IConsumer } from './kafka-consumer.interface';
import { KafkaConsumer } from './kafka.consumer';

interface KafkajsConsumerOptions<
  T = Record<string, string | boolean | number>,
> {
  topic: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: T) => void;
}

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume({ topic, config, onMessage }: KafkajsConsumerOptions) {
    const clientId = this.configService.get(Configuration.KAFKA_NAME_SERVICE);
    const brokers = this.configService
      .get(Configuration.KAFKA_BROKER)
      .split(',');
    const consumer = new KafkaConsumer(topic, config, brokers, clientId);
    await consumer.connect();
    await consumer.consume((message: KafkaMessage) => {
      return this.parseMessage(message, onMessage);
    });

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  private async parseMessage(
    message: KafkaMessage,
    onMessage: KafkajsConsumerOptions['onMessage'],
  ): Promise<void> {
    return onMessage(JSON.parse(message.value.toString()));
  }
}
