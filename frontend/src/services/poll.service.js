
import { api } from './api';

export const getPollsForUser = () => {
  return api.get('/polls/for-user');
};

export const getFeedPollsForYou = () => {
  return api.get('/feed-polls/for-you');
};
