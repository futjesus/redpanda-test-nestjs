import { OnModuleInit } from '@nestjs/common';

import { ConsumptionPort } from '../ports/in';
import { QueueAdapter } from '../adapters/out/queue';

export class ConsumptionApplication implements ConsumptionPort, OnModuleInit {
  private queueAdapter: QueueAdapter;

  constructor({ queueAdapter }) {
    this.queueAdapter = queueAdapter;
  }

  async onModuleInit() {
    await this.queueAdapter.listenTestMessage();
  }
}
