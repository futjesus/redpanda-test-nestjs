import { Logger, OnModuleInit } from '@nestjs/common';
import * as pidusage from 'pidusage';
import * as util from 'util';
import { pid } from 'node:process';
import * as cron from 'node-cron';

import { ConsumptionPort } from '../ports/in';
import { QueueAdapter } from '../adapters/out/queue';
import { ConfigService, Configuration } from 'src/modules/shared';
import { MemoryUsage } from '../domain';

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
  private readonly queueAdapter: QueueAdapter;
  private readonly config: ConfigService;
  private readonly logger: Logger;

  constructor({ config, queueAdapter }) {
    this.config = config;
    this.queueAdapter = queueAdapter;
    this.logger = new Logger('ConsumptionApplication');
  }

  async onModuleInit() {
    await this.listenEvents();

    const cronExpression = this.config.get(
      Configuration.LOAD_CONSUMPTION_CRONJOB,
    );

    const cronTask = () => {
      this.logger.log('Cron job is running!');
      this.loadConsumption();
    };

    cron.schedule(cronExpression, cronTask, {
      scheduled: true,
      timezone: 'UTC',
    });
  }

  async listenEvents() {
    const topic = this.config.get(Configuration.MEMORY_TOPIC);
    const onMessage = () => {};
    this.queueAdapter.listenTestMessage({ topic, onMessage });
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
