import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';
import { E2EEManager } from '../messages/e2ee/e2eeManager';
import { KeyStore } from '../messages/e2ee/keystore';

export interface Message {
  id: string;
  text?: string; // Plain text for display before decryption
  iv?: number[];
  ciphertext?: number[];
  sender: { id: string; name: string };
  timestamp: number;
  reactions: { [key: string]: number };
}

class ChatService extends EventEmitter {
  private e2eeManager: E2EEManager;
  private keyStore: KeyStore;
  private currentSessionId: string | null = null;

  constructor() {
    super();
    this.keyStore = new KeyStore();
    this.e2eeManager = new E2EEManager(this.keyStore);

    realtimeService.on('new-message', (message: Message) => {
      this.handleIncomingMessage(message);
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

  async establishSession(recipientId: string, recipientIdentityKey: any, recipientPreKey: any) {
    this.currentSessionId = await this.e2eeManager.establishSession(recipientId, recipientIdentityKey, recipientPreKey);
    return this.currentSessionId;
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  async handleIncomingMessage(message: Message) {
    if (message.iv && message.ciphertext && this.currentSessionId) {
      try {
        const decryptedText = await this.e2eeManager.decryptMessage(this.currentSessionId, message.iv, message.ciphertext);
        const decryptedMessage = { ...message, text: decryptedText };
        this.emit('new-message', decryptedMessage);
      } catch (error) {
        console.error("Decryption failed, treating as unencrypted message:", error);
        this.emit('new-message', message); // Emit with encrypted content for fallback display
      }
    } else {
      // Handle unencrypted messages or messages for which there's no session
      this.emit('new-message', message);
    }
  }

  getMessages(roomId: string): Promise<Message[]> {
    // In a real app, this would fetch messages from a server
    return Promise.resolve([
      { id: '1', text: 'Hello!', sender: { id: '1', name: 'Alice' }, timestamp: Date.now() - 1000, reactions: { '👍': 1 } },
      { id: '2', text: 'Hi there!', sender: { id: '2', name: 'Bob' }, timestamp: Date.now(), reactions: {} },
    ]);
  }

  async sendMessage(message: { text: string; sender: { id: string; name: string } }): Promise<Message> {
    if (!this.currentSessionId) {
      // For now, sending unencrypted. In a real app, you might want to prevent this.
      console.warn("E2EE session not established. Sending message unencrypted.");
      const messageWithId: Message = {
        ...message,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        reactions: {},
      };
      realtimeService.send('new-message', messageWithId);
      return Promise.resolve(messageWithId);
    }

    const encryptedPayload = await this.e2eeManager.encryptMessage(this.currentSessionId, message.text);

    const messageWithId: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: message.sender,
      timestamp: Date.now(),
      reactions: {},
      ...encryptedPayload,
    };
    realtimeService.send('new-message', messageWithId);
    
    // For immediate display in the sender's UI
    const localMessage: Message = {
        ...messageWithId,
        text: message.text,
    };
    return Promise.resolve(localMessage);
  }

  addReaction(messageId: string, reaction: string) {
    realtimeService.send('new-reaction', { messageId, reaction });
    this.emit('reaction-added', { messageId, reaction });
  }

  startTyping(userName: string) {
    realtimeService.send('typing',