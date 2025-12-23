import { EventEmitter } from 'events';
import { realtimeService } from './realtimeService';
import { apiClient } from './apiClient';

class ChatService extends EventEmitter {
  constructor() {
    super();

    realtimeService.on('new-message', (data) => {
      this.emit('new-message', data.message);
    });
  }

  async establishSession(recipientId, recipientIdentityKey, recipientPreKey) {
    // In a real application, you would use a library like libsignal-protocol.js
    // to establish a secure session with the recipient.
    console.log('Establishing E2EE session with', recipientId);
    return Promise.resolve();
  }

  async getMessages(conversationId) {
    const response = await apiClient.get(`/messages/${conversationId}`);
    return response.data;
  }

  async sendMessage(message) {
    const response = await apiClient.post('/messages/', message);
    return response.data;
  }

  onNewMessage(handler) {
    this.on('new-message', handler);
  }

  offNewMessage() {
    this.removeAllListeners('new-message');
  }
}

export const chatService = new ChatService();
