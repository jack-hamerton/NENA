
import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.events = new Map();
  }

  connect(userId) {
    this.socket = io('http://localhost:3001', { query: { userId } });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    // General purpose signaling for WebRTC
    this.socket.on('signaling-message', (data) => {
      this.emit('signaling-message', data);
    });

    this.socket.on('message-deleted', (data) => {
      this.emit('message-deleted', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  off(eventName, callback) {
    if (this.events.has(eventName)) {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(eventName, data) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(callback => callback(data));
    }
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('chat-message', message);
    }
  }

  deleteMessage(messageId) {
      if(this.socket){
          this.socket.emit('delete-message', { messageId });
      }
  }

  sendSignalingMessage(message) {
    if (this.socket) {
      this.socket.emit('signaling-message', message);
    }
  }

  getCurrentUser() {
    // This is a placeholder. In a real app, you'd get this from your auth system.
    return { id: 'user1', name: 'Alice' };
  }
}

export const chatService = new ChatService();
