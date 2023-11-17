import { Cronjob, CronjobPort } from 'src/modules/loader/ports/out';
import { CronjobService } from 'src/modules/shared';

export class CronjobAdapter implements CronjobPort {
  private readonly cronjob: CronjobService;

  constructor({ cronjob }) {
    this.cronjob = cronjob;
  }

  addTask(params: Cronjob): void {
    this.cronjob.addTask(params);
  }
}
