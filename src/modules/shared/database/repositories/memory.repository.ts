import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemoryConsumption, MemoryConsumptionEntity } from '../entities';

@Injectable()
class MemoryRepository {
  constructor(
    @InjectRepository(MemoryConsumptionEntity)
    private readonly memoryConsumptioEntityRepository: Repository<MemoryConsumptionEntity>,
  ) {}

  public async find({ limit = 10 } = {}) {
    try {
      const memoryEntity = await this.memoryConsumptioEntityRepository.find({
        order: {
          id: 'DESC',
        },
        take: limit,
      });

      return memoryEntity.map(({ randomUuid: id, cpu, memory, createdAt }) => ({
        id,
        cpu,
        memory,
        createdAt,
      }));
    } catch {
      console.log('Error when is trying to get values from the database');
    }
  }

  public async create(
    memoryConsumption: MemoryConsumption,
  ): Promise<MemoryConsumptionEntity> {
    try {
      return await this.memoryConsumptioEntityRepository.save(
        memoryConsumption,
      );
    } catch {
      console.log('Error when is trying to add new value in the database');
    }
  }
}

export { MemoryRepository };
