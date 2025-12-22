
import { api } from './api';

class UserService {
  async getUser(userId) {
    return await api.get(`/users/${userId}`);
  }
}

export const userService = new UserService();
