
import { api } from './api';

export const getForYouFeed = () => {
  return api.get('/posts/for-you');
};

export const getFollowingFeed = () => {
  return api.get('/posts/following');
};

export const getPostsByUser = (userId) => {
  return api.get(`/posts/by-user/${userId}`);
};

export const getPostById = (postId) => {
  return api.get(`/posts/${postId}`);
};

export const createPost = (postData) => {
  return api.post('/posts/', postData);
};

export const reportPost = (postId) => {
  return api.post(`/posts/${postId}/report`);
};

export const getComments = (postId) => {
  return api.get(`/posts/${postId}/comments`);
};

export const createComment = (postId, commentData) => {
  return api.post(`/posts/${postId}/comments`, commentData);
};

export const likePost = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

export const resharePost = (postId) => {
  return api.post(`/posts/${postId}/reshare`);
};
