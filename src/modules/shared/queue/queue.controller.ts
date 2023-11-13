import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { v4 as uuid } from 'uuid';

import { ConfigService, Configuration } from '../config';

@Controller()
export class QueueController implements OnModuleDestroy, OnModuleInit {
  private userTopicName = '';

  constructor(
    @Inject('KAFKA_SERVICE')
    protected readonly _kafkaClient: ClientKafka,
    protected readonly _configService: ConfigService,
  ) {
    this.userTopicName = this._configService.get(Configuration.USER_TOPIC);
  }

  async onModuleInit() {
    this._kafkaClient.subscribeToResponseOf(this.userTopicName);
    await this._kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this._kafkaClient.close();
  }

  @Post('message-kafka')
  async createMessage() {
    this._kafkaClient.emit(this.userTopicName, {
      key: process.pid,
      value: JSON.stringify({
        id: uuid(),
        name: 'Jesús Manuel',
        lastName: 'Fuentes Trejo',
      }),
    });
  }

  @MessagePattern('test.example')
  testExample(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    console.log(originalMessage.value);
    return originalMessage.value;
  }
}
