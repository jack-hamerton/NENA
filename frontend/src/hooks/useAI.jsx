import { createContext, useContext } from 'react';
import axios from 'axios';
import { chatService } from './services/chatService';
import { callService } from './services/callService';
import { postService } from './services/postService';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {

  const conversation = async (prompt) => {
    const response = await axios.post('/api/v1/ai/conversation', { prompt });
    const { action, payload } = response.data;

    switch (action) {
        case 'send_message':
            await sendMessage(payload.message);
            break;
        case 'call':
            await makeCall(payload.user);
            break;
        case 'comment':
            await addComment(payload.comment);
            break;
        default:
            break;
    }

    return response;
  };

  const sendMessage = async (message) => {
    await chatService.sendMessage({ text: message, sender: { id: 'ai', name: 'Nena AI' } });
  };

  const makeCall = async (user) => {
    await callService.startCall(user);
  };

  const addComment = async (comment) => {
    await postService.addComment(comment);
  };

  return (
    <AIContext.Provider value={{ conversation, sendMessage, makeCall, addComment }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
