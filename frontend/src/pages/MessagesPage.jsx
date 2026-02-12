
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
  height: calc(100vh - 60px); // Adjust based on your header height
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

  useEffect(() => {
    if (user) {
      chatService.connect(user.id);

      const handleNewMessage = (message) => {
        if (message.conversationId === (selectedConversation?.id || conversationId)) {
          setMessages(prev => [...prev, message]);
        }
      };

      chatService.on('new-message', handleNewMessage);

      return () => {
        chatService.off('new-message', handleNewMessage);
      };
    }
  }, [user, selectedConversation, conversationId]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/conversations');
        setConversations(response.data);
        if (conversationId) {
          const initialConvo = response.data.find(c => c.id === conversationId);
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
    fetchConversations();
  }, [conversationId, navigate]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/conversations/${selectedConversation.id}/messages`);
        setMessages(response.data.messages);
        setChatUsers(response.data.users);
      } catch (err) {
        setError(`Failed to load messages for ${selectedConversation.name}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

  }, [selectedConversation]);

  const handleSendMessage = useCallback(async (text) => {
    if (!selectedConversation) return;
    
    const recipientId = selectedConversation.users.find(u => u.id !== user.id).id;

    const messageData = {
        text,
        conversationId: selectedConversation.id,
        recipientId: recipientId
    };
    chatService.sendMessage(messageData);

  }, [selectedConversation, user.id]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    navigate(`/messages/${conversation.id}`);
  };

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
          onConversationSelect={handleConversationSelect}
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
