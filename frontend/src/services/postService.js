
import { api } from './api';

class PostService {
  async getForYouFeed() {
    return await api.get('/posts/foryou');
  }

  async getFollowingFeed() {
    return await api.get('/posts/following');
  }

  async createPost(postData) {
    return await api.post('/posts', postData);
  }

  async likePost(postId) {
    return await api.post(`/posts/${postId}/like`);
  }

  async unlikePost(postId) {
    return await api.delete(`/posts/${postId}/like`);
  }

  async getCommentsForPost(postId) {
    return await api.get(`/posts/${postId}/comments`);
  }

  async reportPost(postId) {
    return await api.post(`/posts/${postId}/report`);
  }

  addComment(comment) {
    // In a real app, this would make an API call to add a comment
    console.log(`Adding comment: ${comment}`);
  }
}

export const postService = new PostService();
