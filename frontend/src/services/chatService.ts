import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

export interface Message {
  id: string;
  text: string;
  sender: { id: string; name: string };
  timestamp: number;
  reactions: { [key: string]: number };
}

class ChatService extends EventEmitter {
  constructor() {
    super();

    realtimeService.on('new-message', (message: Message) => {
      this.emit('new-message', message);
    });

    realtimeService.on('new-reaction', ({ messageId, reaction }: { messageId: string; reaction: string }) => {
      this.emit('reaction-added', { messageId, reaction });
    });

    realtimeService.on('typing', (userName: string) => {
      this.emit('typing', userName);
    });

    realtimeService.on('stop-typing', () => {
      this.emit('stop-typing');
    });
  }

  getMessages(roomId: string): Promise<Message[]> {
    // In a real app, this would fetch messages from a server
    return Promise.resolve([
      { id: '1', text: 'Hello!', sender: { id: '1', name: 'Alice' }, timestamp: Date.now() - 1000, reactions: { '👍': 1 } },
      { id: '2', text: 'Hi there!', sender: { id: '2', name: 'Bob' }, timestamp: Date.now(), reactions: {} },
    ]);
  }

  sendMessage(message: { text: string; sender: { id: string; name: string } }): Promise<Message> {
    const messageWithId: Message = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      reactions: {},
    };
    realtimeService.send('new-message', messageWithId);
    return Promise.resolve(messageWithId);
  }

  addReaction(messageId: string, reaction: string) {
    realtimeService.send('new-reaction', { messageId, reaction });
    this.emit('reaction-added', { messageId, reaction });
  }

  startTyping(userName: string) {
    realtimeService.send('typing', userName);
  }

  stopTyping(userName: string) {
    realtimeService.send('stop-typing', userName);
  }

  onNewMessage(callback: (message: Message) => void) {
    this.on('new-message', callback);
  }

  offNewMessage() {
    this.removeAllListeners('new-message');
  }

  onReactionAdded(callback: ({ messageId, reaction }: { messageId: string; reaction: string }) => void) {
    this.on('reaction-added', callback);
  }

  offReactionAdded() {
    this.removeAllListeners('reaction-added');
  }

  onTyping(callback: (userName: string) => void) {
    this.on('typing', callback);
  }

  offTyping() {
    this.removeAllListeners('typing');
  }

  onStopTyping(callback: () => void) {
    this.on('stop-typing', callback);
  }

  offStopTyping() {
    this.removeAllListeners('stop-typing');
  }
}

export const chatService = new ChatService();
