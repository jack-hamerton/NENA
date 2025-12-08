
import { io, Socket } from 'socket.io-client';

class RealtimeService {
  private socket: Socket;

  constructor() {
    // In a real application, this URL would be loaded from a configuration file
    this.socket = io('ws://localhost:3001');

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // Send an event to the server
  send(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Listen for an event from the server
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Stop listening for an event
  off(event: string, callback: (data: any) => void) {
    this.socket.off(event, callback);
  }
}

export const realtimeService = new RealtimeService();
