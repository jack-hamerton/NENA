
import React, { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import { AuthContext } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';
import api from '../services/api';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px); // Adjust based on your header height
  background-color: ${props => props.theme.palette.background.default};
`;

const MessagesPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Centralized real-time listener setup
  useEffect(() => {
    if (!user) return;

    chatService.connect(user.id);

    const handleNewMessage = (message) => {
      // Update the correct conversation in the list
      setConversations(prev => 
        prev.map(c => 
          c.id === message.conversationId 
          ? { ...c, lastMessage: message } 
          : c
        )
      );
      // If the message is for the currently selected conversation, add it to the view
      if (message.conversationId === (selectedConversation?.id || conversationId)) {
        setMessages(prev => [...prev, message]);
      }
    };

    chatService.on('new-message', handleNewMessage);

    return () => {
      chatService.off('new-message', handleNewMessage);
    };
  }, [user, selectedConversation, conversationId]);

  // Fetch initial conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/conversations');
        setConversations(data);
        if (conversationId) {
          const initialConvo = data.find(c => c.id === conversationId);
          if (initialConvo) {
            setSelectedConversation(initialConvo);
          } else {
            navigate('/messages');
          }
        }
      } catch (err) {
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };
    if(user) fetchConversations();
  }, [conversationId, navigate, user]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/conversations/${selectedConversation.id}/messages`);
        setMessages(data.messages);
        setChatUsers(data.users);
      } catch (err) {
        setError(`Failed to load messages.`);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

  }, [selectedConversation]);

  // Corrected function to send a message
  const handleSendMessage = useCallback(async (text) => {
    if (!selectedConversation || !user) return;
    
    const recipient = selectedConversation.users.find(u => u.id !== user.id);
    if(!recipient) {
        console.error("Cannot send message: recipient not found");
        return;
    }

    const messageData = {
        text,
        conversationId: selectedConversation.id,
        recipientId: recipient.id
    };

    chatService.sendMessage(messageData);
    
    // Optimistically update the UI
    const optimisticMessage = { 
        ...messageData, 
        id: Date.now(), // temporary ID
        senderId: user.id, 
        createdAt: new Date().toISOString() 
    };
    setMessages(prev => [...prev, optimisticMessage]);

  }, [selectedConversation, user]);

  // Function to create a new conversation
  const handleCreateConversation = useCallback(async (recipientId, initialMessage) => {
      if(!user) return;
      try {
          const { data: newConversation } = await api.post('/conversations', {
              recipientId,
              initialMessage
          });
          setConversations(prev => [newConversation, ...prev]);
          setSelectedConversation(newConversation);
          navigate(`/messages/${newConversation.id}`);
      } catch (error) {
          console.error("Failed to create conversation", error);
          setError("Could not start a new conversation.");
      }
  }, [user, navigate]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    navigate(`/messages/${conversation.id}`);
  };

  if (!user) {
      return <Typography>Please log in to see your messages.</Typography>
  }

  if (loading && conversations.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  return (
      <MessagesContainer>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onCreateConversation={handleCreateConversation}
          currentUserId={user.id}
        />
        <ChatWindow 
          conversation={selectedConversation} 
          messages={messages}
          users={chatUsers}
          loading={loading}
          error={error}
          onSendMessage={handleSendMessage}
          currentUser={user}
        />
      </MessagesContainer>
  );
};

export default MessagesPage;
