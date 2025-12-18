import axios from 'axios';

const API_URL = '/api/users';

export const getUserPodcasts = (userId) => {
  return axios.get(`${API_URL}/${userId}/podcasts`);
};
