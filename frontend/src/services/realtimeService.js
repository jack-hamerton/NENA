
import { io } from 'socket.io-client';

class RealtimeService {
  socket;

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
  send(event, data) {
    this.socket.emit(event, data);
  }

  // Listen for an event from the server
  on(event, callback) {
    this.socket.on(event, callback);
  }

  // Stop listening for an event
  off(event, callback) {
    this.socket.off(event, callback);
  }
}

export const realtimeService = new RealtimeService();
