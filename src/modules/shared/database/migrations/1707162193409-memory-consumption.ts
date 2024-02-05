import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class MemoryConsumption1707162193409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connect();

    await queryRunner.startTransaction();

    await queryRunner.createTable(
      new Table({
        name: 'memory_consumption',
        columns: [
          {
            name: 'id',
            type: 'SERIAL',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'memory',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cpu',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'random_uuid',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.commitTransaction();
  }

  public async down(): Promise<void> {
    console.log('MemoryConsumption1707162193409');
  }
}
