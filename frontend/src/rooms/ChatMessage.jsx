import React, { useState } from 'react';
import { Message, chatService } from '../services/chatService';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
  isLocal: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLocal }) => {
  const [showReactions, setShowReactions] = useState(false);

  const messageClass = isLocal ? 'chat-message is-local' : 'chat-message';

  const handleAddReaction = (reaction: string) => {
    chatService.addReaction(message.id, reaction);
    setShowReactions(false);
  };

  return (
    <div className={messageClass}>
      <div className="message-sender">{isLocal ? 'You' : message.sender.name}</div>
      <div className="message-text">{message.text}</div>
      <div className="reactions-container">
        <button className="reaction-button" onClick={() => setShowReactions(!showReactions)}>😊</button>
        {showReactions && (
          <div className="reactions-list">
            <span className="reaction" onClick={() => handleAddReaction('👍')}>👍</span>
            <span className="reaction" onClick={() => handleAddReaction('❤️')}>❤️</span>
            <span className="reaction" onClick={() => handleAddReaction('😂')}>😂</span>
            <span className="reaction" onClick={() => handleAddReaction('😮')}>😮</span>
            <span className="reaction" onClick={() => handleAddReaction('😢')}>😢</span>
            <span className="reaction" onClick={() => handleAddReaction('🙏')}>🙏</span>
          </div>
        )}
      </div>
      {message.reactions && (
        <div className="reactions-display">
          {Object.entries(message.reactions).map(([reaction, count]) => (
            <span key={reaction}>{reaction} {count}</span>
          ))}
        </div>
      )}
    </div>
  );
};
