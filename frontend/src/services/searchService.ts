import axios from 'axios';
import { DiscoverResult } from '../types/discover';

export const searchService = {
  search: async (query: string): Promise<DiscoverResult[]> => {
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
