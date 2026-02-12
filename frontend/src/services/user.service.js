
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/users';

export const followUser = (userId, intent) => {
  return axios.post(`${API_URL}/${userId}/follow`, { intent });
};

export const getUserPosts = (userId) => {
  return axios.get(`${API_URL}/${userId}/posts`);
};

export const getUserPodcasts = (userId) => {
  return axios.get(`${API_URL}/${userId}/podcasts`);
};

export const getMe = () => {
  return axios.get(`${API_URL}/me`);
}

export const updateProfile = (userId, profileData) => {
  return axios.put(`${API_URL}/${userId}/profile`, profileData);
}
