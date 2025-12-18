import axios from 'axios';

const API_URL = '/api/podcasts';

const createPodcast = (data) => {
  return axios.post(API_URL, data);
};

export default {
  createPodcast,
};
