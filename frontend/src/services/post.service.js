
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/v1/posts';

// ... (existing functions) ...

/**
 * Fetches all posts created by a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getPostsByUser = (userId) => {
  return axios.get(`${API_URL}/by-user/${userId}`, { headers: authHeader() });
};
