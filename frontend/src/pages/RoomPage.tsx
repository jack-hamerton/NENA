
import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatRoom } from '../components/ChatRoom';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <div>Room not found</div>;
  }

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <ChatRoom roomId={roomId} />
    </div>
  );
};
