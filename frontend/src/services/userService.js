
import apiClient from './api';

class UserService {
  async getUser(userId) {
    return await apiClient.get(`/users/${userId}`);
  }
}

export const userService = new UserService();
