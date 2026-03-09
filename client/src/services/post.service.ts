import api from "@/lib/api";
import { Post, Comment } from "@/types";

export const postService = {
  getFeed: async (page = 1) => {
    const response = await api.get<Post[]>(`/posts?page=${page}`);
    return response.data;
  },

  getForYouFeed: async () => {
    const response = await api.get<Post[]>("/posts/for-you");
    return response.data;
  },

  getFollowingFeed: async () => {
    const response = await api.get<Post[]>("/posts/following");
    return response.data;
  },

  getPostsByHashtag: async (hashtag: string) => {
    const response = await api.get<Post[]>(`/posts/hashtag/${hashtag}`);
    return response.data;
  },

  createPost: async (postData: { content: string; image_url?: string | null }) => {
    const response = await api.post<Post>("/posts", postData);
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post<{ imageUrl: string }>("/posts/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  reportPost: async (postId: string) => {
    await api.post(`/posts/${postId}/report`);
  },

  likePost: async (postId: string) => {
    await api.post(`/posts/${postId}/like`);
  },

  getComments: async (postId: string) => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },
};
