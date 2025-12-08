
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

interface Room {
  id: string;
  name: string;
  users: string[];
}

class RoomService extends EventEmitter {
  constructor() {
    super();

    realtimeService.on('user-joined-room', (data: { roomId: string; userId: string }) => {
      this.emit('user-joined-room', data);
    });

    realtimeService.on('user-left-room', (data: { roomId: string; userId: string }) => {
      this.emit('user-left-room', data);
    });
  }

  joinRoom(roomId: string) {
    realtimeService.send('join-room', { roomId });
  }

  leaveRoom(roomId: string) {
    realtimeService.send('leave-room', { roomId });
  }
}

export const roomService = new RoomService();
