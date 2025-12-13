import { createContext, useContext, ReactNode } from 'react';
import axios, { AxiosResponse } from 'axios';

interface AIContextType {
  conversation: (prompt: string) => Promise<AxiosResponse<string>>;
}

const AIContext = createContext<AIContextType | null>(null);

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

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
