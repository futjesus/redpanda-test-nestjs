import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketService } from './socket.service';

@WebSocketGateway({
  namespace: 'socket',
  path: '/socket/socket.io',
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  handleConnection(socket: Socket): void {
    const { username } = socket.handshake.auth;

    if (!username) {
      socket.disconnect();
    }

    this.socketService.handleConnection(socket, username);
  }

  handleDisconnect(socket: Socket) {
    this.socketService.handleDisconnect(socket);
  }
}
