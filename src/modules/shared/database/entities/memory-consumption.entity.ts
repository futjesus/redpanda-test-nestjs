import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

const enum TABLE_DETAIL {
  TABLE_NAME = 'memory_consumption',
  ID = 'id',
  MEMORY = 'memory',
  CPU = 'cpu',
  RANDOM_UUID = 'random_uuid',
  UPDATED_AT = 'updated_at',
  CREATED_AT = 'created_at',
}

export type MemoryConsumption = {
  memory: string;
  cpu: string;
  randomUuid: string;
};

@Entity({ name: TABLE_DETAIL.TABLE_NAME })
class MemoryConsumptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: TABLE_DETAIL.MEMORY })
  memory: string;

  @Column({ name: TABLE_DETAIL.CPU })
  cpu: string;

  @Column({ name: TABLE_DETAIL.RANDOM_UUID, type: 'uuid' })
  randomUuid: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    name: TABLE_DETAIL.UPDATED_AT,
    select: false,
  })
  updatedAt: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    name: TABLE_DETAIL.CREATED_AT,
    select: false,
  })
  createdAt: string;
}

export { MemoryConsumptionEntity };
