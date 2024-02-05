import { Provider } from '@nestjs/common';

import { MemoryRepository } from '../../../../shared/database/repositories/memory.repository';

import { MemoryDatabaseAdapter } from './memory.adapter';

type AdapterType = MemoryDatabaseAdapter;

interface Type<T> {
  new (...args: any[]): T;
}

const InjectBuilderAdapters = [MemoryRepository];

const useFactoryBuilder =
  (AdapterClass: Type<AdapterType>) => (memoryRepository: MemoryRepository) => {
    return new AdapterClass({
      memoryRepository,
    });
  };

export const AdapterDatabaseConfig: Provider[] = [
  {
    provide: MemoryDatabaseAdapter,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(MemoryDatabaseAdapter),
  },
];
