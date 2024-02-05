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

  public async find({ limit = 10 }) {
    return this.memoryConsumptioEntityRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });
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
