import { MemoryUsage } from '../../domain';

import { Message } from './queue.port';

export abstract class MemoryPort {
  abstract find(): Promise<(MemoryUsage & { id: string })[]>;
  abstract create(message: Message): Promise<void>;
}
