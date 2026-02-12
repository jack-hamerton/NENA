
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/users';

const followUser = (userId, intent) => {
  return axios.post(`${API_URL}/${userId}/follow`, { intent });
};

const getUserPosts = (userId) => {
  return axios.get(`${API_URL}/${userId}/posts`);
};

const getUserPodcasts = (userId) => {
  return axios.get(`${API_URL}/${userId}/podcasts`);
};

const userService = {
  followUser,
  getUserPosts,
  getUserPodcasts,
};

export default userService;
