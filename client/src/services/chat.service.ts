import api from "@/lib/api";
import { Conversation, Message } from "@/types";

export const chatService = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>("/api/communication/conversations");
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get<Message[]>(`/api/communication/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post<Message>(`/api/communication/conversations/${conversationId}/messages`, { content });
    return response.data;
  },
};
