
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/v1/user';

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getUserPodcasts = (userId) => {
  return axios.get(`${API_URL}/${userId}/podcasts`);
};

/**
 * Fetches a user by their username.
 * @param {string} username - The username of the user to fetch.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getUserByUsername = (username) => {
  return axios.get(`${API_URL}/by-username/${username}`, { headers: authHeader() });
};

/**
 * Follow a user.
 * @param {string} userId - The ID of the user to follow.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const followUser = (userId) => {
  return axios.post(`${API_URL}/${userId}/follow`, {}, { headers: authHeader() });
};

/**
 * Unfollow a user.
 * @param {string} userId - The ID of the user to unfollow.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const unfollowUser = (userId) => {
  return axios.delete(`${API_URL}/${userId}/follow`, { headers: authHeader() });
};
