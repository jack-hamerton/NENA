
import apiClient from './api';

class UserService {
  async getUser(userId) {
    return await apiClient.get(`/users/${userId}`);
  }

  async getFollowers(userId) {
    return await apiClient.get(`/users/${userId}/followers`);
  }

  async getFollowing(userId) {
    return await apiClient.get(`/users/${userId}/following`);
  }

  async followUser(userId, intent) {
    return await apiClient.post(`/users/${userId}/follow`, { intent });
  }

  async updateProfile(userId, profileData) {
    return await apiClient.put(`/users/${userId}/profile`, profileData);
  }

  async getUserPosts(userId) {
    return await apiClient.get(`/users/${userId}/posts`);
  }

  async getUserPodcasts(userId) {
    return await apiClient.get(`/users/${userId}/podcasts`);
  }

  async getFollowerIntentMetrics(userId) {
    return await apiClient.get(`/users/${userId}/metrics/follower-intent`);
  }

  async getUserHashtagMetrics(userId) {
    return await apiClient.get(`/users/${userId}/metrics/hashtags`);
  }

  async getUserBadges(userId) {
    return await apiClient.get(`/users/${userId}/badges`);
  }

  async getFollowersOfFollowers(userId) {
    return await apiClient.get(`/users/${userId}/followers/followers`);
  }
}

export const userService = new UserService();
