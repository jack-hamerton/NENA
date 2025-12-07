
import React, { useState, useEffect, useRef } from 'react';
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
  const [viewOnce, setViewOnce] = useState(false);
  const [viewedFiles, setViewedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageToSend = {
      text: newMessage,
      sender: localParticipant,
    };

    const sentMessage = await chatService.sendMessage(channelId, messageToSend);
    setMessages([...messages, sentMessage]);
    setNewMessage('');
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

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map(msg => {
          if ('text' in msg) {
            return <ChatMessage key={msg.id} message={msg} isLocal={msg.sender.id === localParticipant.id} />;
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
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
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
