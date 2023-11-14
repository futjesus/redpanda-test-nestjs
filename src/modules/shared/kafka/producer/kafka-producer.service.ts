import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Message } from 'kafkajs';

import { ConfigService, Configuration } from '../../config';
import { QueueProducePort } from '../../../loader/ports/out';

import { KafkaProducer } from './kafka.producer';
import { IProducer } from './kafka-producer.interface';

@Injectable()
export class KafkaProducerService
  implements OnApplicationShutdown, QueueProducePort
{
  private readonly producers = new Map<string, IProducer>();

  constructor(private readonly configService: ConfigService) {}

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    const clientId = this.configService.get(Configuration.KAFKA_NAME_SERVICE);
    const brokers = this.configService
      .get(Configuration.KAFKA_BROKER)
      .split(',');

    if (!producer) {
      producer = new KafkaProducer(topic, brokers, clientId);
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
