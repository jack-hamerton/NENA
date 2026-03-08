
import api from './api';

const getProfileData = async (userId) => {
  try {
    const response = await api.get(`/profile/${userId}/follower-web`);
    return {
      data: {
        user: response.data.user || { id: userId, name: 'Unknown', followers: [] },
        followerIntentMetrics: response.data.followerIntentMetrics || {}
      }
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    // Return default structure on error
    return {
      data: {
        user: { id: userId, name: 'Unknown', followers: [] },
        followerIntentMetrics: {}
      }
    };
  }
};

const profileService = {
    getProfileData,
};

export default profileService;
