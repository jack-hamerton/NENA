import apiClient from './api';

export const handlePrompt = async (prompt) => {
  const response = await apiClient.post('/ai/assist', { 
    prompt: prompt,
    context: {
      type: 'prompt'
    }
  });
  return response.data.response || response.data;
};

export const chatWithAI = async (message) => {
  const response = await apiClient.post('/ai/chat', { 
    message: message
  });
  return response.data.response || response.data;
};

export const rewriteText = async (text, tone) => {
  const response = await apiClient.post('/ai/assist', { 
    prompt: text, 
    context: {
      type: 'rewrite',
      tone: tone
    }
  });
  return response.data.rewritten_text;
};

export const summarizeText = async (text) => {
  const response = await apiClient.post('/ai/assist', { 
    prompt: text, 
    context: {
      type: 'summarize'
    }
  });
  return response.data.response;
};

export const suggestNextSteps = async (text) => {
  const response = await apiClient.post('/ai/assist', { 
    prompt: text, 
    context: {
      type: 'suggest_next_steps'
    }
  });
  return response.data;
};
