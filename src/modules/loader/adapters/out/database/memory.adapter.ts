import { MemoryUsage } from 'src/modules/loader/domain';
import { Message } from 'src/modules/loader/ports/out';
import { MemoryPort } from 'src/modules/loader/ports/out/database.port';
import {
  MemoryConsumption,
  MemoryRepository,
} from 'src/modules/shared/database';

class MemoryDatabaseAdapter implements MemoryPort {
  private memoryRepository: MemoryRepository;

  constructor({ memoryRepository }) {
    this.memoryRepository = memoryRepository;
  }

  async find(): Promise<(MemoryUsage & { id: string; createdAt: string })[]> {
    return this.memoryRepository.find();
  }

  async create(message: Message): Promise<void> {
    const data = {
      randomUuid: message.id,
      cpu: message.cpu,
      memory: message.memory,
    } as MemoryConsumption;

    this.memoryRepository.create(data);
  }
}

export { MemoryDatabaseAdapter };
