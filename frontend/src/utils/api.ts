import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Replace with your API base URL

export const api = {
  get: (endpoint) => axios.get(`${API_URL}${endpoint}`),
  post: (endpoint, data) => axios.post(`${API_URL}${endpoint}`, data),
  put: (endpoint, data) => axios.put(`${API_URL}${endpoint}`, data),
  delete: (endpoint) => axios.delete(`${API_URL}${endpoint}`),
};
