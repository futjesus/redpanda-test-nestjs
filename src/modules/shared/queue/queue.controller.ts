import {
  Controller,
  OnModuleDestroy,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { v4 as uuid } from 'uuid';

import { ConfigService, Configuration } from '../config';

@Controller()
export class QueueController implements OnModuleDestroy, OnModuleInit {
  private kafkaClient: Kafka;
  private kafkaConsumer: Consumer;
  private kafkaProducer: Producer;

  constructor(protected readonly configService: ConfigService) {
    const brokers = configService.get(Configuration.KAFKA_BROKER).split(',');
    const clientId = configService.get(Configuration.KAFKA_NAME_SERVICE);

    this.kafkaClient = new Kafka({
      clientId,
      brokers,
    });
  }

  async onModuleInit() {
    const topic = this.configService.get(Configuration.USER_TOPIC);
    const groupId = this.configService.get(Configuration.KAFKA_NAME_CONSUMER);
    this.kafkaConsumer = this.kafkaClient.consumer({
      groupId: `${groupId}-${process.pid}`,
    });
    this.kafkaProducer = this.kafkaClient.producer();

    await this.kafkaConsumer.connect();
    await this.kafkaProducer.connect();

    await this.kafkaConsumer.subscribe({
      topic,
      fromBeginning: true,
    });

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        const testTopic = this.configService.get(Configuration.USER_TOPIC);
        const mapper = {
          [testTopic]: this.testMethod,
        };

        mapper[topic](JSON.parse(message.value.toString()));
      },
    });
  }

  async onModuleDestroy() {
    this.kafkaConsumer.disconnect();
    this.kafkaProducer.disconnect();
  }

  @Post('message-kafka')
  async createMessage() {
    const topic = this.configService.get(Configuration.USER_TOPIC);
    this.kafkaProducer.send({
      topic,
      messages: [
        {
          key: String(process.pid),
          value: JSON.stringify({
            id: uuid(),
            name: 'Jesús Manuel',
            lastName: 'Fuentes Trejo',
          }),
        },
      ],
    });
  }

  private testMethod(message: any) {
    console.log(message);
  }
}
