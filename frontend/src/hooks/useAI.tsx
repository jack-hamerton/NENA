import { useContext, createContext, ReactNode } from 'react';
import * as aiService from '../services/aiService';

interface AIContextType {
  conversation: (prompt: string, conversation_history?: any[]) => Promise<any>;
  generateContent: (prompt: string, mode?: string) => Promise<any>;
  assistWithCode: (code: string, language: string, task?: string) => Promise<any>;
  translate: (text: string, target_language: string) => Promise<any>;
  solveProblem: (problem: string) => Promise<any>;
  webBrowse: (query: string) => Promise<any>;
  analyzeImage: (image_path: string, prompt: string) => Promise<any>;
  generateImage: (prompt: string) => Promise<any>;
  analyzeData: (file_path: string, analysis_prompt: string) => Promise<any>;
  voiceConversation: (audio: Blob) => Promise<any>;
  runAgent: (task_prompt: string) => Promise<any>;
  customGpt: (prompt: string, gpt_id: string) => Promise<any>;
  updateMemory: (conversation_data: any) => Promise<any>;
  feedback: (feedback_data: any) => Promise<any>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {

  const value = {
    conversation: aiService.conversation,
    generateContent: aiService.generateContent,
    assistWithCode: aiService.assistWithCode,
    translate: aiService.translate,
    solveProblem: aiService.solveProblem,
    webBrowse: aiService.webBrowse,
    analyzeImage: aiService.analyzeImage,
    generateImage: aiService.generateImage,
    analyzeData: aiService.analyzeData,
    voiceConversation: aiService.voiceConversation,
    runAgent: aiService.runAgent,
    customGpt: aiService.customGpt,
    updateMemory: aiService.updateMemory,
    feedback: aiService.feedback,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
