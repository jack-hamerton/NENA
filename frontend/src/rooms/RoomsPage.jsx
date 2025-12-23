
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { roomService } from '../services/roomService';
import Room from '../components/Room';

const RoomsPageContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};
  height: 100%;
`;

const RoomsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const RoomCard = styled(Link)`
  background-color: ${props => props.theme.palette.primary};
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RoomTitle = styled.h3`
  color: ${props => props.theme.palette.secondary};
  margin-top: 0;
`;

const CreateRoomForm = styled.form`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
`;

const CreateRoomInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.palette.secondary};
`;

const CreateRoomButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  cursor: pointer;
`;

const RoomsPage = () => {
  const { id: roomId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    if (!roomId) {
      const fetchRooms = async () => {
        const roomsData = await roomService.getRooms();
        setRooms(roomsData);
      };

      fetchRooms();
    }
  }, [roomId]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      const newRoom = await roomService.createRoom(newRoomName);
      setRooms(prev => [...prev, newRoom]);
      setNewRoomName('');
    }
  };

  if (roomId) {
    return <Room />;
  }

  return (
    <RoomsPageContainer>
      <h1>Rooms</h1>
      <CreateRoomForm onSubmit={handleCreateRoom}>
        <CreateRoomInput 
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter new room name"
        />
        <CreateRoomButton type="submit">Create Room</CreateRoomButton>
      </CreateRoomForm>
      <RoomsList>
        {rooms.map(room => (
          <RoomCard key={room.id} to={`/room/${room.id}`}>
            <RoomTitle>{room.name}</RoomTitle>
          </RoomCard>
        ))}
      </RoomsList>
    </RoomsPageContainer>
  );
};

export default RoomsPage;
