import { EventEmitter } from 'events';

class RealtimeService extends EventEmitter {
  send(event: string, data: any) {
    // Simulate sending data to a server
    // In a real app, this would use WebSockets or another real-time protocol
    this.emit(event, data);
  }
}

export const realtimeService = new RealtimeService();
