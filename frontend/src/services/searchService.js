import axios from 'axios';
import { cryptoUtils } from '../utils/crypto';

export const searchService = {
  search: async (query) => {
    if (!query) {
      return [];
    }
    try {
        const encryptedQuery = cryptoUtils.encrypt(query);
      const response = await axios.get(`/api/v1/search?query=${encryptedQuery}`);
      return response.data;
    } catch (error) {
      console.error('Error during search:', error);
      return [];
    }
  },
};
