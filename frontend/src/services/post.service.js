import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/posts/';

const getPosts = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const createPost = (post) => {
  return axios.post(API_URL, post, { headers: authHeader() });
};

export default {
  getPosts,
  createPost,
};
