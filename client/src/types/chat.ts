export interface ChatConversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  messageType?: "text" | "system" | "image" | "file";
  mediaUrl?: string;
  isViewOnce?: boolean;
  isDisappearing?: boolean;
  disappearingTimer?: number; // seconds
  isEncrypted?: boolean;
}
