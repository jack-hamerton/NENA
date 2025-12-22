
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const RoomsPageContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};
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

const RoomsPage = () => {
  // This is just a placeholder. In a real application, you would fetch the
  // list of rooms from your backend.
  const rooms = [
    { id: '1', name: 'Tech Talk' },
    { id: '2', name: 'Design Hangout' },
    { id: '3', name: 'Chill and Chat' },
  ];

  return (
    <RoomsPageContainer>
      <h1>Rooms</h1>
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
