
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/documents'; // Adjust if your backend URL is different

/**
 * Fetches a document by its ID. If the document doesn't exist, the backend will create it.
 * @param {string} documentId - The unique identifier for the document.
 * @returns {Promise<Object>} The document data.
 */
export const getDocument = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

/**
 * Updates the content of a document.
 * @param {string} documentId - The unique identifier for the document.
 * @param {string} content - The new content to save.
 * @returns {Promise<Object>} The updated document data.
 */
export const updateDocument = async (documentId, content) => {
  try {
    const response = await axios.put(`${API_URL}/${documentId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};
