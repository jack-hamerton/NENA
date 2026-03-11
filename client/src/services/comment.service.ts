import api from "@/lib/api";

export interface Comment {
  id: string;
  episodeId: string;
  userId: string;
  username: string;
  text: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
}

export const commentService = {
  getComments: async (episodeId: string) => {
    const response = await api.get<Comment[]>(`/comments/episode/${episodeId}`);
    return response.data;
  },

  createComment: async (data: { episodeId: string; text: string; parentId?: string }) => {
    const response = await api.post<Comment>("/comments", data);
    return response.data;
  },
};
