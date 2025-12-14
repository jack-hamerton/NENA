
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

class ChatService extends EventEmitter {
  constructor() {
    super();

    // Listen for incoming messages from the realtimeService
    realtimeService.on('new-message', (message) => {
      this.emit('new-message', message);
    });
  }

  getMessages(roomId) {
    // In a real app, this would fetch messages from a server
    return Promise.resolve([
      { id: '1', text: 'Hello!', sender: { id: '1', name: 'Alice' }, timestamp: Date.now() - 1000 },
      { id: '2', text: 'Hi there!', sender: { id: '2', name: 'Bob' }, timestamp: Date.now() },
    ]);
  }

  sendMessage(message) {
    const messageWithId = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    realtimeService.send('send-message', messageWithId);
    return Promise.resolve(messageWithId);
  }
}

export const chatService = new ChatService();
