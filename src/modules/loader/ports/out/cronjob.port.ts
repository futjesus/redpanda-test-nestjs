export interface Cronjob {
  expression: string;
  callback: () => void;
}

export abstract class CronjobPort {
  abstract addTask(params: Cronjob): void;
}
