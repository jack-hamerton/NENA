// This is a mock chat service. In a real application, this would be replaced with API calls to your backend.

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
}

const messages: Message[] = [
  {
    id: '1',
    text: 'Hello everyone!',
    sender: {
      id: '1', // Corresponds to localParticipant
      name: 'Local User',
    },
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    text: 'Hi there!',
    sender: {
      id: '2', // Corresponds to a remote participant
      name: 'Remote User 1',
    },
    timestamp: Date.now() - 1000 * 60 * 4,
  },
];

export const chatService = {
  async getMessages(channelId: string): Promise<Message[]> {
    // In a real app, you'd fetch messages for a specific channel
    // For now, we return all mock messages
    return Promise.resolve(messages);
  },

  async sendMessage(channelId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: String(Date.now()),
      timestamp: Date.now(),
    };
    messages.push(newMessage);
    return Promise.resolve(newMessage);
  },
};
