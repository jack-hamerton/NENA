import { createContext, useContext } from 'react';
import axios from 'axios';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {

  const conversation = async (prompt) => {
    const response = await axios.post('/api/v1/ai/conversation', { prompt });
    return response;
  };

  return (
    <AIContext.Provider value={{ conversation }}>
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
