
import { api } from './api';

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getUserPodcasts = (userId) => {
  return api.get(`/users/${userId}/podcasts`);
};

export const getUserPosts = (userId) => {
  return api.get(`/users/${userId}/posts`);
};

export const getUserByUsername = (username) => {
  return api.get(`/user/by-username/${username}`);
};

export const followUser = (userId, intent) => {
  return api.post(`/user/${userId}/follow`, { intent });
};

export const unfollowUser = (userId) => {
  return api.delete(`/user/${userId}/follow`);
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

export const getFollowers = (userId) => {
  return api.get(`/users/${userId}/followers`);
};
