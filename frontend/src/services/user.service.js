
import api from './api';

export const followUser = async (currentUserId, targetUserId, intent) => {
  try {
    return await api.post(`/social/follow`, { 
      follower_id: currentUserId,
      followed_id: targetUserId,
      intent 
    });
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

export const getUserPodcasts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/podcasts`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user podcasts:', error);
    return [];
  }
};

export const getMe = async () => {
  try {
    return await api.get(`/users/me`);
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    return await api.put(`/users/${userId}`, profileData);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
