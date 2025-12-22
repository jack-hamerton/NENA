
import { api } from './api';

export const search = (query, type) => {
  return api.get(`/discover/search?query=${query}&type=${type}`);
};
