
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/podcasts';

const getPodcasts = () => {
  return axios.get(API_URL);
};

const createPodcast = (podcastData) => {
  return axios.post(API_URL, podcastData);
};

export { getPodcasts, createPodcast };
