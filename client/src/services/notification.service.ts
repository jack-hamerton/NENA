import api from "@/lib/api";
import { Notification } from "@/types/notification";

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  clearReadNotifications: async () => {
    const response = await api.delete("/notifications/read");
    return response.data;
  },
};
