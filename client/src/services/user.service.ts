import api from "@/lib/api";
import { User } from "@/types";

export const userService = {
  getProfile: async (username: string) => {
    const response = await api.get<User>(`/users/${username}`);
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  },

  followUser: async (userId: string) => {
    await api.post(`/users/${userId}/follow`);
  },

  searchUsers: async (query: string) => {
    const response = await api.get<User[]>(`/users/search?q=${query}`);
    return response.data;
  },
};
