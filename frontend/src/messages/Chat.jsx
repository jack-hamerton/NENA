
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

// --- Styled Components ---
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.background || '#35424c'};
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.borderColor || '#333'};
  background-color: ${props => props.theme.surface || '#4a5969'};
  color: ${props => props.theme.text.primary || '#ffffff'};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const BackButton = styled(FaArrowLeft)`
    margin-right: 1rem;
    cursor: pointer;
    font-size: 1.2rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  margin-bottom: 0.5rem;
  color: #fff;
  align-self: ${props => props.isSender ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isSender ? (props.theme.accent || '#73beb0') : (props.theme.surface || '#4a5969')};
  border: 1px solid ${props => props.isSender ? 'transparent' : (props.theme.borderColor || '#333')};
`;

const MessageInputContainer = styled.form`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.borderColor || '#333'};
  background-color: ${props => props.theme.surface || '#4a5969'};
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.borderColor || '#333'};
  background-color: ${props => props.theme.background || '#35424c'};
  color: ${props => props.theme.text.primary || '#ffffff'};
  margin-right: 1rem;
`;

const SendButton = styled.button`
  background: ${props => props.theme.accent || '#73beb0'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    background: ${props => props.theme.accentHover || '#427973'};
  }
`;

const Placeholder = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    color: ${props => props.theme.text.secondary || '#a0a0a0'};
    padding: 2rem;
`;

// --- Chat Component ---
const Chat = ({ conversation, currentUserId, onSendMessage, theme, isMobile, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const recipient = conversation?.participants.find(p => p.id !== currentUserId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '' && conversation) {
        onSendMessage(conversation.id, newMessage);
        setNewMessage('');
    }
  };

  if (!conversation) {
    return (
        <Placeholder theme={theme}>
            <h2>Welcome to Messaging</h2>
            <p>Select a conversation from the list on the left to start chatting.</p>
            <p>If you're on a mobile device, you might need to find the conversation list first.</p>
        </Placeholder>
    )
  }

  return (
    <ChatContainer theme={theme}>
      <ChatHeader theme={theme}>
        {isMobile && <BackButton onClick={onBack} />}
        <Avatar src={recipient?.avatar} alt={recipient?.name} />
        <h3>{recipient?.name}</h3>
      </ChatHeader>
      <MessageList>
        {conversation.messages.map((msg, index) => (
          <MessageBubble key={index} isSender={msg.senderId === currentUserId} theme={theme}>
            {msg.content}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <MessageInputContainer onSubmit={handleSendMessage}>
          <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          />
          <SendButton type="submit">
              <FaPaperPlane />
          </SendButton>
      </MessageInputContainer>
    </ChatContainer>
  );
};

export default Chat;
