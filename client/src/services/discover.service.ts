import api from "@/lib/api";
import { SearchType, User, Post, Hashtag, Room } from "@/types";

export const discoverService = {
  search: async (query: string, type: SearchType) => {
    if (!query) return [];
    
    const response = await api.get<User[] | Post[] | Hashtag[] | Room[]>(
      `/discover/search?query=${encodeURIComponent(query)}&type=${type}`
    );
    return response.data;
  },
};
