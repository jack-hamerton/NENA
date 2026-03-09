import api from "@/lib/api";
import { Post, Comment } from "@/types";

export const postService = {
  getFeed: async (page = 1) => {
    const response = await api.get<Post[]>(`/posts?page=${page}`);
    return response.data;
  },

  createPost: async (content: string, media?: File) => {
    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);
    const response = await api.post<Post>("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  likePost: async (postId: string) => {
    await api.post(`/posts/${postId}/like`);
  },

  getComments: async (postId: string) => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },
};
