import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ScheduledTask, schedule, validate } from 'node-cron';

import { Cronjob } from 'src/modules/loader/ports/out';

@Injectable()
export class CronjobService implements OnApplicationShutdown {
  private tasks: ScheduledTask[] = [];

  addTask({ expression, callback }: Cronjob) {
    const isValidExpression = validate(expression);

    if (!isValidExpression) {
      throw new Error('The expression is invalid!');
    }

    const task = schedule(expression, callback, {
      scheduled: true,
      timezone: process.env.TZ,
    });

    task.start();
    this.tasks.push(task);
  }

  onApplicationShutdown() {
    for (const task of this.tasks) {
      task.stop();
    }
  }
}
