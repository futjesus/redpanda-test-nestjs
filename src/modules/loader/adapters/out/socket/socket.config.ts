import { Provider } from '@nestjs/common';

import { SocketAdapter } from './socket.adapter';
import { SocketService } from 'src/modules/shared/socket.io';

type AdapterType = SocketAdapter;

interface Type<T> {
  new (...args: any[]): T;
}

const InjectBuilderAdapters = [SocketService];

const useFactoryBuilder =
  (AdapterClass: Type<AdapterType>) => (socket: SocketService) => {
    return new AdapterClass({ socket });
  };

export const AdapterSocketConfig: Provider[] = [
  {
    provide: SocketAdapter,
    inject: [...InjectBuilderAdapters],
    useFactory: useFactoryBuilder(SocketAdapter),
  },
];
