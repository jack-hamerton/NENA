"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  fetchConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const DUMMY_FIREBASE_CONFIG = {
  apiKey: "dummy-api-key",
  authDomain: "nena-dummy.firebaseapp.com",
  projectId: "nena-dummy",
  storageBucket: "nena-dummy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Mock user ID - in a real app, this would come from AuthContext
  const currentUserId = "user_123";

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      // Connecting to the new Python backend
      const response = await fetch(`http://localhost:5001/api/communication/conversations?userId=${currentUserId}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (receiverId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`http://localhost:5001/api/communication/messages?senderId=${currentUserId}&receiverId=${receiverId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch('http://localhost:5001/api/communication/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedConversation.id,
          content
        }),
      });
      
      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchConversations();
  }, [fetchConversations]);

  // Firebase Real-time Listener Simulation
  useEffect(() => {
    if (selectedConversation) {
      // In a real app with Firebase Web SDK:
      // const q = query(collection(db, "messages"), where("receiverId", "==", currentUserId));
      // const unsubscribe = onSnapshot(q, (snapshot) => { ... });
      
      console.log("Firebase real-time listener active for", selectedConversation.name);
      
      const interval = setInterval(() => {
        // Mocking a real-time incoming message every 30 seconds
        console.log("Checking for real-time updates from Firebase...");
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedConversation,
        messages,
        isLoading,
        isLoadingMessages,
        fetchConversations,
        selectConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
