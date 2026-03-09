export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}
