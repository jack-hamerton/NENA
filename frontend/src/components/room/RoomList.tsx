import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';

export const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await api.get('/rooms');
      setRooms(response.data);
    };
    fetchRooms();
  }, []);

  return (
    <div>
      {rooms.map(room => (
        <div key={room.id}>
          <Link to={`/rooms/${room.id}`}>{room.name}</Link>
        </div>
      ))}
    </div>
  );
};
