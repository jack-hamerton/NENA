import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/ai';

// --- Core AI Capabilities ---

export const conversation = (prompt, conversation_history) => {
  return axios.post(`${API_URL}/conversation`, { prompt, conversation_history }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const generateContent = (prompt, mode = "draft") => {
  return axios.post(`${API_URL}/generate_content`, { prompt, mode }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const assistWithCode = (code, language, task = "explain") => {
  return axios.post(`${API_URL}/assist_with_code`, { code, language, task }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const translate = (text, target_language) => {
  return axios.post(`${API_URL}/translate`, { text, target_language }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const solveProblem = (problem) => {
  return axios.post(`${API_URL}/solve_problem`, { problem }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};


// --- Advanced Tools & Modes ---

export const webBrowse = (query) => {
  return axios.post(`${API_URL}/web_browse`, { query }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const analyzeImage = (image_path, prompt) => {
  return axios.post(`${API_URL}/analyze_image`, { image_path, prompt }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const generateImage = (prompt) => {
  return axios.post(`${API_URL}/generate_image`, { prompt }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const analyzeData = (file_path, analysis_prompt) => {
  return axios.post(`${API_URL}/analyze_data`, { file_path, analysis_prompt }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const voiceConversation = (audio) => {
  const formData = new FormData();
  formData.append('audio', audio);
  return axios.post(`${API_URL}/voice_conversation`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const runAgent = (task_prompt) => {
  return axios.post(`${API_URL}/run_agent`, { task_prompt }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const customGpt = (prompt, gpt_id) => {
  return axios.post(`${API_URL}/custom_gpt`, { prompt, gpt_id }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};


// --- Learning and Personalization ---

export const updateMemory = (conversation_data) => {
  return axios.post(`${API_URL}/update_memory`, { conversation_data }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const feedback = (feedback_data) => {
  return axios.post(`${API_URL}/feedback`, { feedback_data }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};
