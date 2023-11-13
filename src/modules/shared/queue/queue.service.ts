import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class QueueService {
  constructor(
    @Inject('REDPANDA_SERVICE')
    protected readonly _redpandaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this._redpandaClient.subscribeToResponseOf('test-example');
    await this._redpandaClient.connect();
  }

  async onModuleDestroy() {
    await this._redpandaClient.close();
  }
}
