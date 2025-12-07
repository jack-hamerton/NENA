import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { Whiteboard } from '../collaboration/Whiteboard';

export const Room = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const response = await api.get(`/rooms/${roomId}`);
      setRoom(response.data);
    };
    fetchRoom();
  }, [roomId]);

  if (!room) return <div>Loading...</div>;

  return (
    <div>
      <h2>{room.name}</h2>
      <Whiteboard roomId={roomId} />
      {/* Chat component will go here */}
    </div>
  );
};
