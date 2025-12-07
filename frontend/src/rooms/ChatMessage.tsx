import React from 'react';
import { Message } from '../services/chatService';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
  isLocal: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLocal }) => {
  const messageClass = isLocal ? 'chat-message is-local' : 'chat-message';

  return (
    <div className={messageClass}>
      <div className="message-sender">{isLocal ? 'You' : message.sender.name}</div>
      <div className="message-text">{message.text}</div>
    </div>
  );
};
