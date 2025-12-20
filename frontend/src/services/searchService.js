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
      // Decrypt search results
        response.data = response.data.map(result => {
            try {
                return {
                    ...result,
                    // Assuming the field to decrypt is 'name' or 'title'
                    name: result.name ? cryptoUtils.decrypt(result.name) : undefined,
                    title: result.title ? cryptoUtils.decrypt(result.title) : undefined,
                    // Add other fields to decrypt as necessary
                };
            } catch (e) {
                console.error("Failed to decrypt search result", result, e);
                return result;
            }
        });
      return response.data;
    } catch (error) {
      console.error('Error during search:', error);
      return [];
    }
  },
};
