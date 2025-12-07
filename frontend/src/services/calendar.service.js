import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/events/';

const getEvents = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

export default {
  getEvents,
};
