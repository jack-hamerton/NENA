
import axios from 'axios';

// NOTE: adjust this URL to match your AI microservice or backend
const API_URL = 'http://localhost:3002/api/ai';

const rewriteText = async (text, tone) => {
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

const chatWithAI = async (messages) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { messages });
    return response.data;
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw error;
  }
};

const handlePrompt = async (prompt) => {
  try {
    const response = await axios.post(`${API_URL}/prompt`, { prompt });
    return response.data;
  } catch (error) {
    console.error('Error handling prompt:', error);
    throw error;
  }
};

export const aiService = {
  rewriteText,
  chatWithAI,
  handlePrompt,
};
