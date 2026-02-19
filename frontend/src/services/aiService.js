
import axios from 'axios';

const API_URL = 'http://localhost:3002/api/ai';

export const rewriteText = async (text, tone) => {
  try {
    const response = await axios.post(`${API_URL}/rewrite`, {
      text,
      tone,
    });
    return response.data.rewrittenText;
  } catch (error) {
    console.error('Error rewriting text:', error);
    throw error;
  }
};

export const chatWithAI = async (messages) => {
    try {
        const response = await axios.post(`${API_URL}/chat`, { messages });
        return response.data;
    } catch (error) {
        console.error('Error chatting with AI:', error);
        throw error;
    }
};

export const handlePrompt = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/prompt`, { prompt });
        return response.data;
    } catch (error) {
        console.error('Error handling prompt:', error);
        throw error;
    }
};
