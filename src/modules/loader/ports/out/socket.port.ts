import { Message } from './queue.port';

export abstract class SocketPort {
  abstract emitMessage(message: Message): Promise<void>;
}
