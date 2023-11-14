import { Controller, OnModuleInit, Post } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { ConfigService, Configuration } from '../config';
import { KafkaConsumerService } from './consumer';
import { KafkaProducerService } from './producer';

@Controller()
export class KafkaController implements OnModuleInit {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly kafkaConsumeService: KafkaConsumerService,
    protected readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async onModuleInit() {
    const groupId = this.configService.get(Configuration.KAFKA_NAME_CONSUMER);
    const topic = this.configService.get(Configuration.USER_TOPIC);

    await this.kafkaConsumeService.consume({
      topic: {
        topics: [topic],
        fromBeginning: true,
      },
      config: { groupId: `${groupId}-${process.pid}` },
      onMessage: this.readMessage,
    });
  }

  @Post('message-kafka')
  async createMessage() {
    const topic = this.configService.get(Configuration.USER_TOPIC);

    this.kafkaProducerService.produce(topic, {
      key: String(process.pid),
      value: JSON.stringify({
        id: uuid(),
        name: 'Jesús Manuel',
        lastName: 'Fuentes Trejo',
      }),
    });
  }

  private readMessage(message: Record<string, string>) {
    console.log(message);
  }
}
