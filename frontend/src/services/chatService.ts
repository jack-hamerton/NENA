
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

interface Message {
  id: string;
  content: string;
  author: string;
  roomId: string;
}

class ChatService extends EventEmitter {
  constructor() {
    super();

    // Listen for incoming messages from the realtimeService
    realtimeService.on('new-message', (message: Message) => {
      this.emit('new-message', message);
    });
  }

  sendMessage(roomId: string, content: string) {
    // In a real app, the author would be the current user
    const message: Partial<Message> = {
      content,
      roomId,
      author: 'current-user', // This would be replaced with the actual user
    };
    realtimeService.send('send-message', message);
  }
}

export const chatService = new ChatService();
