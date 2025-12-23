
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/podcasts';

const getPodcasts = () => {
  return axios.get(API_URL);
};

const createPodcast = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getTopPodcasts = (type, region) => {
  return axios.get(`${API_URL}/top?type=${type}&region=${region}`);
};

export { getPodcasts, createPodcast, getTopPodcasts };
