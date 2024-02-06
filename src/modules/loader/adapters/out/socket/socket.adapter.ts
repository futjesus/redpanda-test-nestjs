import { Message, SocketPort } from 'src/modules/loader/ports/out';
import { EventListener, SocketService } from 'src/modules/shared/socket.io';

export class SocketAdapter implements SocketPort {
  private socket: SocketService;

  constructor({ socket }) {
    this.socket = socket;
  }

  async emitMessage(message?: Message): Promise<void> {
    this.socket.emitMessage(message);
  }

  async emitMessageNewUserConnected(callback: () => void): Promise<void> {
    this.socket.registerEventListeners(
      EventListener.CONNECT_NEW_USER,
      callback,
    );
  }
}
