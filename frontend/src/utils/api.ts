import axios from 'axios';

const API_URL = '/api'; // Replace with your API base URL

export const api = {
  get: (endpoint, config) => axios.get(`${API_URL}${endpoint}`, config),
  post: (endpoint, data, config) => axios.post(`${API_URL}${endpoint}`, data, config),
  put: (endpoint, data, config) => axios.put(`${API_URL}${endpoint}`, data, config),
  delete: (endpoint, config) => axios.delete(`${API_URL}${endpoint}`, config),
};
