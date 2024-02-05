import { Logger, OnModuleInit } from '@nestjs/common';
import * as pidusage from 'pidusage';
import * as util from 'util';
import { pid } from 'node:process';

import { ConfigService, Configuration } from '../../shared';
import { MemoryUsage } from '../domain';
import { ConsumptionPort } from '../ports/in';
import { Message } from '../ports/out';
import { QueueAdapter } from '../adapters/out/queue';
import { MemoryDatabaseAdapter } from '../adapters/out/database';
import { CronjobAdapter } from '../adapters/out/cronjob';
import { SocketAdapter } from '../adapters/out/socket';

interface Stat {
  cpu: number;
  memory: number;
  ppid: number;
  pid: number;
  ctime: number;
  elapsed: number;
  timestamp: number;
}

export class ConsumptionApplication implements ConsumptionPort, OnModuleInit {
  private readonly config: ConfigService;
  private readonly queueAdapter: QueueAdapter;
  private readonly cronjobAdapter: CronjobAdapter;
  private readonly socketAdapter: SocketAdapter;
  private readonly logger: Logger;
  private readonly memoryDatabaseAdapter: MemoryDatabaseAdapter;

  constructor({
    config,
    queueAdapter,
    cronjobAdapter,
    socketAdapter,
    memoryDatabaseAdapter,
  }) {
    this.logger = new Logger('ConsumptionApplication');
    this.config = config;
    this.queueAdapter = queueAdapter;
    this.cronjobAdapter = cronjobAdapter;
    this.socketAdapter = socketAdapter;
    this.memoryDatabaseAdapter = memoryDatabaseAdapter;
  }

  async onModuleInit() {
    const isEnabledTopicToConsume =
      this.config.get(Configuration.MEMORY_TOPIC_ENABLED_TO_CONSUME) === 'true';
    const isEnabledTopicToProduce =
      this.config.get(Configuration.MEMORY_TOPIC_ENABLED_TO_PRODUCE) === 'true';

    if (isEnabledTopicToConsume) {
      await this.startListenEvents();
    }

    if (isEnabledTopicToProduce) {
      await this.startProduceEvents();
    }
  }

  async startListenEvents() {
    const topic = this.config.get(Configuration.MEMORY_TOPIC);

    this.queueAdapter.listenTestMessage({
      topic,
      onMessage: (message: Message) => {
        this.socketAdapter.emitMessage(message);
        this.memoryDatabaseAdapter.create(message);
      },
    });
  }

  async startProduceEvents() {
    const expression = this.config.get(Configuration.LOAD_CONSUMPTION_CRONJOB);
    this.cronjobAdapter.addTask({
      expression,
      callback: () => {
        this.logger.log('Cron job is running!');
        this.loadConsumption();
      },
    });
  }

  async loadConsumption(): Promise<void> {
    const pidusagePromise = util.promisify<number, Promise<Stat>>(pidusage);
    const topic = this.config.get(Configuration.MEMORY_TOPIC);

    try {
      const stats = await pidusagePromise(pid);
      const memoryUsage: MemoryUsage = {
        cpu: stats.cpu.toFixed(2),
        memory: this.formatBytes(stats.memory),
      };
      this.queueAdapter.publishMessage({ topic, message: memoryUsage });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private formatBytes(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) {
      return '0 Byte';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${Math.round(100 * (bytes / Math.pow(1024, i))) / 100} ${sizes[i]}`;
  }
}
