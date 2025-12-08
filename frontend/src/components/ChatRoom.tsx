
import React, { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { roomService } from '../services/roomService';

interface Message {
  id: string;
  content: string;
  author: string;
  roomId: string;
}

interface ChatRoomProps {
  roomId: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Join the room when the component mounts
    roomService.joinRoom(roomId);

    // Listen for new messages
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    chatService.on('new-message', handleNewMessage);

    // Listen for users joining and leaving
    const handleUserJoined = ({ roomId: joinedRoomId, userId }: { roomId: string, userId: string }) => {
      if (joinedRoomId === roomId) {
        setUsers((prevUsers) => [...prevUsers, userId]);
      }
    };
    const handleUserLeft = ({ roomId: leftRoomId, userId }: { roomId: string, userId: string }) => {
      if (leftRoomId === roomId) {
        setUsers((prevUsers) => prevUsers.filter((u) => u !== userId));
      }
    };
    roomService.on('user-joined-room', handleUserJoined);
    roomService.on('user-left-room', handleUserLeft);

    // Leave the room when the component unmounts
    return () => {
      roomService.leaveRoom(roomId);
      chatService.off('new-message', handleNewMessage);
      roomService.off('user-joined-room', handleUserJoined);
      roomService.off('user-left-room', handleUserLeft);
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      chatService.sendMessage(roomId, message);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Messages</h2>
        <div>
          {messages.map((msg) => (
            <div key={msg.id}>
              <strong>{msg.author}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
