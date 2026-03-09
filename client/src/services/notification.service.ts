import api from "@/lib/api";

export interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    await api.patch(`/notifications/${notificationId}/read`);
  },
};
