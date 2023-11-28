import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/modules/loader/ports/out';

interface Client {
  id: string;
  username: string;
}

export enum EventMapper {
  SEND_MESSAGE = 'send-message',
}

@Injectable()
export class SocketService {
  public server: Server;
  private readonly connectedClients: Map<string, Client> = new Map();

  handleConnection(socket: Socket, username: Client['username']): void {
    const clientId = socket.id;

    const client: Client = {
      id: clientId,
      username,
    };

    this.connectedClients.set(clientId, client);
  }

  handleDisconnect(socket: Socket) {
    const clientId = socket.id;
    this.connectedClients.delete(clientId);
  }

  public async emitMessage(message: Message): Promise<void> {
    this.server.emit(EventMapper.SEND_MESSAGE, message);
  }
}
