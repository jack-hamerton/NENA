import api from "@/lib/api";
import { Conversation, Message, SendMessageInput } from "@/types";

export const messageService = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>("/messages/conversations");
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get<Message[]>(`/messages/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (data: SendMessageInput) => {
    const response = await api.post<Message>("/messages/send", data);
    return response.data;
  },

  getConversationById: async (id: string) => {
    const response = await api.get<Conversation>(`/messages/conversations/${id}`);
    return response.data;
  }
};
