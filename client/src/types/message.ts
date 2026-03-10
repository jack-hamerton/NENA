import { User } from "./auth";

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
  participants: User[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  type: "chat" | "system";
  isMe?: boolean;
}

export interface SendMessageInput {
  conversationId: string;
  content: string;
  type?: "chat" | "system";
}
