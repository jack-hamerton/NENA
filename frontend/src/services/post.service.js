
import apiClient from './api';

export const uploadImage = (image) => {
  const formData = new FormData();
  formData.append('image', image);
  return apiClient.post('/posts/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadVideo = (video) => {
  const formData = new FormData();
  formData.append('file', video);
  return apiClient.post('/posts/upload-video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getForYouFeed = () => {
  return apiClient.get('/posts/for-you');
};

export const getFollowingFeed = () => {
  return apiClient.get('/posts/following');
};

export const getPostsByUser = (userId) => {
  return apiClient.get(`/posts/by-user/${userId}`);
};

export const getPostById = (postId) => {
  return apiClient.get(`/posts/${postId}`);
};

export const createPost = (postData) => {
  return apiClient.post('/posts/', postData);
};

export const reportPost = (postId) => {
  return apiClient.post(`/posts/${postId}/report`);
};

export const getComments = (postId) => {
  return apiClient.get(`/posts/${postId}/comments`);
};

export const createComment = (postId, commentData) => {
  return apiClient.post(`/posts/${postId}/comments`, commentData);
};

export const likePost = (postId) => {
  return apiClient.post(`/posts/${postId}/like`);
};

export const getPostsByHashtag = (hashtag) => {
    return apiClient.get(`/posts/hashtag/${hashtag}`);
};  
