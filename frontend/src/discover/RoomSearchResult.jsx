import React from 'react';
import styled from 'styled-components';

const RoomCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => props.theme.palette.primary};
`;

const RoomName = styled.h4`
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const RoomDescription = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;

const RoomSearchResult = ({ room }) => {
  return (
    <RoomCard>
      <RoomName>{room.name}</RoomName>
      <RoomDescription>{room.description}</RoomDescription>
    </RoomCard>
  );
};

export default RoomSearchResult;
