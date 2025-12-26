import { api } from './api';

export const rewriteText = async (text, tone) => {
  const response = await api.post('/ai/assist', { 
    prompt: text, 
    context: {
      type: 'rewrite',
      tone: tone
    }
  });
  return response.data.rewritten_text;
};

export const summarizeText = async (text) => {
  const response = await api.post('/ai/assist', { 
    prompt: text, 
    context: {
      type: 'summarize'
    }
  });
  return response.data.response;
};

export const suggestNextSteps = async (text) => {
  const response = await api.post('/ai/assist', { 
    prompt: text, 
    context: {
      type: 'suggest_next_steps'
    }
  });
  return response.data;
};
