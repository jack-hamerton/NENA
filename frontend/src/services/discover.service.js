
import apiClient from './api';

export const search = (query, type) => {
  return apiClient.get(`/discover/search?query=${query}&type=${type}`);
};
