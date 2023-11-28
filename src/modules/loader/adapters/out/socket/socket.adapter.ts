import { Message, SocketPort } from 'src/modules/loader/ports/out';
import { SocketService } from 'src/modules/shared/socket.io';

export class SocketAdapter implements SocketPort {
  private socket: SocketService;

  constructor({ socket }) {
    this.socket = socket;
  }

  async emitMessage(message?: Message): Promise<void> {
    this.socket.emitMessage(message);
  }
}
