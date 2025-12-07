import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/projects/';

const getProjects = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

export default {
  getProjects,
};
