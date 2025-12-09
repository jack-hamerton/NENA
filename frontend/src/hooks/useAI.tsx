import { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

const AIContext = createContext<any>(null);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider = ({ children }: AIProviderProps) => {

  const conversation = async (prompt: string) => {
    const response = await axios.post('/api/v1/ai/conversation', { prompt });
    return response;
  };

  return (
    <AIContext.Provider value={{ conversation }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
