import { Provider } from '@nestjs/common';

import { CronjobAdapter } from './cronjob.adapter';
import { CronjobService } from 'src/modules/shared/cronjob';

type AdapterType = CronjobAdapter;

interface Type<T> {
  new (...args: any[]): T;
}

const InjectBuilderAdapters = [CronjobService];

const useFactoryBuilder =
  (AdapterClass: Type<AdapterType>) => (cronjob: CronjobService) => {
    return new AdapterClass({
      cronjob,
    });
  };

export const AdapterCronjobConfig: Provider[] = [
  {
    provide: CronjobAdapter,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(CronjobAdapter),
  },
];
