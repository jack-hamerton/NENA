
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';

// --- Simulated Backend API and WebSocket ---
// In a real app, this would be in a separate api.js file and use a real WebSocket library.
const mockUsers = {
  1: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=currentuser' },
  2: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=johndoe' },
  3: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=janesmith' },
  4: { name: 'Kibera Safe Passage', avatar: 'https://i.pravatar.cc/150?u=kibera' },
};

const mockConversations = [
  { id: 'general', name: 'John Doe', lastMessage: 'See you tomorrow!', timestamp: '10:30 AM', unread: 2, online: true, users: [1, 2] },
  { id: 'support', name: 'Jane Smith', lastMessage: 'Okay, sounds good.', timestamp: 'Yesterday', unread: 0, online: false, users: [1, 3] },
  { id: 'campaign-kibera-general', name: 'Kibera Safe Passage', lastMessage: 'Great news! Meeting scheduled.', timestamp: '12:45 PM', unread: 5, online: true, users: [1, 4] },
];

const mockMessages = {
  'general': [
    { id: 1, text: 'Hey there!', timestamp: '10:28 AM', senderId: 2 },
    { id: 2, text: 'See you tomorrow!', timestamp: '10:30 AM', senderId: 2 },
  ],
  'support': [
    { id: 1, text: 'I need help with my account.', timestamp: 'Yesterday', senderId: 1 },
    { id: 2, text: 'Okay, sounds good.', timestamp: 'Yesterday', senderId: 3 },
  ],
  'campaign-kibera-general': [
      { id: 1, text: "Welcome to the official channel for the #KiberaSafePassage campaign!", timestamp: "12:40 PM", senderId: 4 },
      { id: 2, text: "I'm excited to be here! How can I help?", timestamp: "12:42 PM", senderId: 1 },
      { id: 3, text: "Great news! Our meeting with the MCA has been scheduled for next Tuesday.", timestamp: "12:45 PM", senderId: 4 },
  ]
};

// This simulates a WebSocket connection for a given room.
const createMockWebSocket = (roomId, onMessage) => {
    const interval = setInterval(() => {
        const newMessage = {
            id: Date.now(),
            text: `This is a real-time update for ${roomId}! The time is ${new Date().toLocaleTimeString()}`,
            timestamp: new Date().toLocaleTimeString(),
            senderId: 4 // Simulate message from the campaign bot
        };
        onMessage(newMessage);
    }, 15000);

    return {
        close: () => clearInterval(interval)
    };
};


const messagesApi = {
  getConversations: async () => {
    await new Promise(res => setTimeout(res, 500));
    return mockConversations;
  },
  getMessages: async (conversationId) => {
    await new Promise(res => setTimeout(res, 700));
    if (mockMessages[conversationId]) {
      const messages = mockMessages[conversationId];
      const users = mockConversations.find(c => c.id === conversationId)?.users || [];
      return { 
          messages: messages.map(m => ({ ...m, user: mockUsers[m.senderId] })),
          users: users.map(id => mockUsers[id])
      };
    }
    throw new Error("Conversation not found.");
  },
  sendMessage: async (conversationId, text) => {
    await new Promise(res => setTimeout(res, 300));
    const newMessage = { id: Date.now(), text, timestamp: new Date().toLocaleTimeString(), senderId: 1, user: mockUsers[1] };
    console.log(`Sending message to ${conversationId}:`, newMessage);
    // In a real app, the backend would broadcast this via WebSocket, not the client.
    return newMessage;
  }
};
// --- End of API Simulation ---

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px); // Adjust based on your header height
  background-color: ${props => props.theme.palette.background.default};
`;

const MessagesPage = () => {
  const { conversationId } = useParams(); // Get conversation ID from URL
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the list of all conversations on initial load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const convos = await messagesApi.getConversations();
        setConversations(convo s);
        // If a conversationId is in the URL, select it.
        const initialConvo = convos.find(c => c.id === conversationId);
        if (initialConvo) {
          setSelectedConversation(initialConvo);
        }
      } catch (err) {
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [conversationId]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { messages, users } = await messagesApi.getMessages(selectedConversation.id);
        setMessages(messages);
        setChatUsers(users);
      } catch (err) {
        setError(`Failed to load messages for ${selectedConversation.name}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    
    // Set up the mock WebSocket connection
    const socket = createMockWebSocket(selectedConversation.id, (newMessage) => {
        setMessages(prev => [...prev, { ...newMessage, user: mockUsers[newMessage.senderId] }]);
    });
    
    // Clean up the connection on component unmount or conversation change
    return () => socket.close();

  }, [selectedConversation]);

  const handleSendMessage = useCallback(async (text) => {
    if (!selectedConversation) return;
    
    // Optimistic UI update
    const tempId = Date.now();
    const newMessage = { id: tempId, text, timestamp: new Date().toLocaleTimeString(), senderId: 1, user: mockUsers[1], status: 'sending' };
    setMessages(prev => [...prev, newMessage]);

    try {
      const savedMessage = await messagesApi.sendMessage(selectedConversation.id, text);
      // Replace the temp message with the one from the server
      setMessages(prev => prev.map(m => m.id === tempId ? { ...savedMessage, status: 'sent' } : m));
    } catch (err) {
      // Mark the message as failed
      setMessages(prev => prev.map(m => m.id === tempId ? { ...newMessage, status: 'failed' } : m));
    }
  }, [selectedConversation]);

  if (loading && conversations.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  if (error && conversations.length === 0) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  return (
      <MessagesContainer>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={setSelectedConversation}
        />
        <ChatWindow 
          conversation={selectedConversation} 
          messages={messages}
          users={chatUsers}
          loading={loading}
          error={error}
          onSendMessage={handleSendMessage}
        />
      </MessagesContainer>
  );
};

export default MessagesPage;
