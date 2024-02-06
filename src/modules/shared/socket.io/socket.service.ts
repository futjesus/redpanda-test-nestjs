import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/modules/loader/ports/out';

interface Client {
  id: string;
  username: string;
}

export enum EventMapper {
  SEND_MESSAGE = 'send-message',
  SEND_MESSAGE_INITIAL = 'send-message-initial',
}

export enum EventListener {
  CONNECT_NEW_USER = 'CONNECT_NEW_USER',
}

@Injectable()
export class SocketService {
  public server: Server;
  private readonly connectedClients: Map<string, Client> = new Map();
  private readonly registeredEventListeners: Map<string, (() => void)[]> =
    new Map();

  async handleConnection(
    socket: Socket,
    username: Client['username'],
  ): Promise<void> {
    const clientId = socket.id;

    const client: Client = {
      id: clientId,
      username,
    };

    this.connectedClients.set(clientId, client);

    const emitMessagesNewUserConnected = this.registeredEventListeners.get(
      EventListener.CONNECT_NEW_USER,
    );

    if (emitMessagesNewUserConnected) {
      for (const callback of emitMessagesNewUserConnected) {
        const resultCallback = await callback();
        socket.emit(EventMapper.SEND_MESSAGE_INITIAL, resultCallback);
      }
    }
  }

  handleDisconnect(socket: Socket) {
    const clientId = socket.id;
    this.connectedClients.delete(clientId);
  }

  public async emitMessage(message: Message): Promise<void> {
    this.server.emit(EventMapper.SEND_MESSAGE, message);
  }

  public registerEventListeners(type: EventListener, callback: () => void) {
    callback();
    switch (type) {
      case EventListener.CONNECT_NEW_USER:
        const currentEvents = this.registeredEventListeners.get(type);

        if (currentEvents) {
          return this.registeredEventListeners.set(type, [
            ...currentEvents,
            callback,
          ]);
        }

        return this.registeredEventListeners.set(type, [callback]);
    }
  }
}
