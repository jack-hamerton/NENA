
import axios from 'axios';

// Base URL for AI API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const rewriteText = async (text, tone) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/assist`, {
      prompt: text,
      context: { type: "rewrite", tone: tone }
    });
    return response.data;
  } catch (error) {
    console.error('Error rewriting text:', error);
    throw error;
  }
};

const chatWithAI = async (messages) => {
  try {
    const lastMessage = messages[messages.length - 1] || '';
    const response = await axios.post(`${API_BASE_URL}/ai/assist`, {
      prompt: lastMessage,
      context: { type: "chat" }
    });
    return response.data;
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw error;
  }
};

const handlePrompt = async (prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/assist`, {
      prompt: prompt
    });
    return response.data;
  } catch (error) {
    console.error('Error handling prompt:', error);
    throw error;
  }
};

const summarizeText = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/assist`, {
      prompt: text,
      context: { type: "summarize" }
    });
    return response.data;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};

const suggestNextSteps = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/assist`, {
      prompt: text,
      context: { type: "suggest_next_steps" }
    });
    return response.data;
  } catch (error) {
    console.error('Error suggesting next steps:', error);
    throw error;
  }
};

export const aiService = {
  rewriteText,
  chatWithAI,
  handlePrompt,
  summarizeText,
  suggestNextSteps,
};
