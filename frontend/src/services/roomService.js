
import { apiService } from './apiService';
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

class RoomService extends EventEmitter {
  constructor() {
    super();

    realtimeService.on('user-joined', (data) => {
      this.emit('user-joined', data);
    });

    realtimeService.on('user-left', (data) => {
      this.emit('user-left', data);
    });

    realtimeService.on('user-removed', () => {
      this.emit('user-removed');
    });
  }

  async createRoom(name) {
    const { data } = await apiService.post('/rooms/', { name });
    return data;
  }

  async getRooms() {
    const { data } = await apiService.get('/rooms/');
    return data;
  }

  async getRoom(roomId) {
    const { data } = await apiService.get(`/rooms/${roomId}`);
    return data;
  }

  joinRoom(roomId, userId) {
    realtimeService.connect(roomId, userId);
    realtimeService.send({ type: 'join-room' });
  }

  leaveRoom(roomId, userId) {
    realtimeService.send({ type: 'leave-room' });
    realtimeService.disconnect();
  }

  removeUser(roomId, userId) {
    realtimeService.send({ type: 'remove-user', userId });
  }
}

export const roomService = new RoomService();
