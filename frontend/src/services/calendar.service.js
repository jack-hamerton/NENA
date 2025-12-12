import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/v1/calendar/';

const getEvents = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const createEvent = (event, participant_ids) => {
  return axios.post(API_URL, event, { headers: authHeader(), params: { participant_ids } });
}

const updateEvent = (id, event) => {
  return axios.put(API_URL + id, event, { headers: authHeader() });
}

const deleteEvent = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
}

const respondToInvitation = (id, response) => {
  return axios.put(API_URL + 'invitations/' + id, null, { headers: authHeader(), params: { response } });
}

export default {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  respondToInvitation
};
