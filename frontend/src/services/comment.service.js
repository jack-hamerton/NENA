
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/comments';

const getComments = (episodeId) => {
  return axios.get(`${API_URL}/episode/${episodeId}`);
};

const createComment = (commentData) => {
  return axios.post(API_URL, commentData);
};

export { getComments, createComment };
