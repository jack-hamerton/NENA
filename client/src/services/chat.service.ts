import api from "@/lib/api";
import { Conversation, Message } from "@/types";

export const chatService = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>("/chat/conversations");
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get<Message[]>(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post<Message>(`/chat/conversations/${conversationId}/messages`, { content });
    return response.data;
  },
};
