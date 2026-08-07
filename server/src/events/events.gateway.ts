import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected: ${client.id}`);
  }

  @SubscribeMessage('board:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() boardId: string,
  ) {
    for (const room of client.rooms) {
      if (room.startsWith('board:')) await client.leave(room);
    }
    await client.join(`board:${boardId}`);
    this.logger.log(`client ${client.id} joined board:${boardId}`);
    return { ok: true };
  }

  emitToBoard(boardId: string, event: string, payload: unknown) {
    this.server.to(`board:${boardId}`).emit(event, payload);
  }
}
