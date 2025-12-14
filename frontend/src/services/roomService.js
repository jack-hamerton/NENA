
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

class RoomService extends EventEmitter {
  constructor() {
    super();

    realtimeService.on('user-joined-room', (data) => {
      this.emit('user-joined-room', data);
    });

    realtimeService.on('user-left-room', (data) => {
      this.emit('user-left-room', data);
    });
  }

  joinRoom(roomId) {
    realtimeService.send('join-room', { roomId });
  }

  leaveRoom(roomId) {
    realtimeService.send('leave-room', { roomId });
  }
}

export const roomService = new RoomService();
