
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
}

class ChatService extends EventEmitter {
  constructor() {
    super();

    // Listen for incoming messages from the realtimeService
    realtimeService.on('new-message', (message: Message) => {
      this.emit('new-message', message);
    });
  }

  getMessages(roomId: string): Promise<Message[]> {
    // In a real app, this would fetch messages from a server
    return Promise.resolve([
      { id: '1', text: 'Hello!', sender: { id: '1', name: 'Alice' }, timestamp: Date.now() - 1000 },
      { id: '2', text: 'Hi there!', sender: { id: '2', name: 'Bob' }, timestamp: Date.now() },
    ]);
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const messageWithId: Message = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    realtimeService.send('send-message', messageWithId);
    return Promise.resolve(messageWithId);
  }
}

export const chatService = new ChatService();
