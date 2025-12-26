import { createContext, useContext } from 'react';
import { handlePrompt, chatWithAI } from '../services/aiService';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const processPrompt = async (prompt) => {
    const response = await handlePrompt(prompt);
    // Potentially handle actions here in the future
    return response;
  };

  const conversation = async (prompt) => {
    const response = await chatWithAI(prompt);
    return response;
  };

  return (
    <AIContext.Provider value={{ processPrompt, conversation }}>
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
