
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/users';
const SOCIAL_URL = 'http://localhost:8000/api/v1/social';

export const followUser = async (currentUserId, targetUserId, intent) => {
  try {
    return await axios.post(`${SOCIAL_URL}/follow`, { 
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
    const response = await axios.get(`${API_URL}/${userId}/posts`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

export const getUserPodcasts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/podcasts`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user podcasts:', error);
    return [];
  }
};

export const getMe = async () => {
  try {
    return await axios.get(`${API_URL}/me`);
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    return await axios.put(`${API_URL}/${userId}`, profileData);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
