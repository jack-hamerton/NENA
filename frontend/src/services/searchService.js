import axios from 'axios';

export const searchService = {
  search: async (query) => {
    if (!query) {
      return [];
    }
    try {
      const response = await axios.get(`/api/v1/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error during search:', error);
      return [];
    }
  },
};
