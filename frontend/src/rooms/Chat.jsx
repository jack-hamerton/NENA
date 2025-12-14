import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { chatService, Message } from '../services/chatService';
import { fileService, SharedFile } from '../services/fileService';
import { ChatMessage } from './ChatMessage';
import './Chat.css';

interface ChatProps {
  channelId: string;
  localParticipant: {
    id: string;
    name: string;
  };
}

export const Chat: React.FC<ChatProps> = ({ channelId, localParticipant }) => {
  const [messages, setMessages] = useState<(Message | SharedFile)[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [viewOnce, setViewOnce] = useState(false);
  const [viewedFiles, setViewedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const [chatHistory, fileHistory] = await Promise.all([
        chatService.getMessages(channelId),
        fileService.getFiles(channelId),
      ]);
      const combinedHistory = [...chatHistory, ...fileHistory].sort((a, b) => a.timestamp - b.timestamp);
      setMessages(combinedHistory);
    };
    fetchHistory();

    const handleNewMessage = (message: Message) => {
      if (message.sender.id !== localParticipant.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    const handleReactionAdded = ({ messageId, reaction }: { messageId: string; reaction: string }) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [reaction]: (msg.reactions[reaction] || 0) + 1,
                },
              }
            : msg
        )
      );
    };

    chatService.onNewMessage(handleNewMessage);
    chatService.onReactionAdded(handleReactionAdded);
    chatService.onTyping((name) => setTypingUser(name));
    chatService.onStopTyping(() => setTypingUser(null));

    return () => {
      chatService.offNewMessage();
      chatService.offReactionAdded();
      chatService.offTyping();
      chatService.offStopTyping();
    };
  }, [channelId, localParticipant.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    chatService.startTyping(localParticipant.name);

    typingTimeoutRef.current = setTimeout(() => {
      chatService.stopTyping(localParticipant.name);
    }, 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      chatService.stopTyping(localParticipant.name);
    }

    const messageToSend = {
      text: newMessage,
      sender: localParticipant,
    };

    const sentMessage = await chatService.sendMessage(messageToSend);
    setMessages([...messages, sentMessage]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendFile(file);
    }
  };

  const handleSendFile = async (file: File) => {
    const sentFile = await fileService.uploadFile(file, localParticipant, viewOnce);
    setMessages([...messages, sentFile]);
    setViewOnce(false); // Reset checkbox
  };

  const handleViewFile = (fileId: string) => {
    setViewedFiles([...viewedFiles, fileId]);
    setTimeout(() => {
      setViewedFiles(prev => prev.filter(id => id !== fileId));
    }, 5000); // Hide after 5 seconds
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map(msg => {
          if ('text' in msg) {
            return <ChatMessage key={msg.id} message={msg as Message} isLocal={msg.sender.id === localParticipant.id} />;
          } else {
            const isViewed = viewedFiles.includes(msg.id);
            return (
              <div key={msg.id} className={`chat-message ${msg.sender.id === localParticipant.id ? 'is-local' : ''}`}>
                <div className="message-sender">{msg.sender.id === localParticipant.id ? 'You' : msg.sender.name}</div>
                <div className="message-text">
                  {msg.viewOnce ? (
                    isViewed ? (
                      <a href={msg.url} target="_blank" rel="noopener noreferrer">{msg.name}</a>
                    ) : (
                      <button onClick={() => handleViewFile(msg.id)}>View File</button>
                    )
                  ) : (
                    <a href={msg.url} target="_blank" rel="noopener noreferrer">{msg.name}</a>
                  )}
                </div>
              </div>
            );
          }
        })}
        {typingUser && <div className="typing-indicator">{typingUser} is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
        />
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
        <button type="button" onClick={() => fileInputRef.current?.click()}>Share File</button>
        <label>
          <input type="checkbox" checked={viewOnce} onChange={(e) => setViewOnce(e.target.checked)} />
          View Once
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
