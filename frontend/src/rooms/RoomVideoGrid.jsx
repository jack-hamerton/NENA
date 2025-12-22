
import React from 'react';
import styled from 'styled-components';
import { Participant } from '../services/callService';
import { ParticipantTile } from './ParticipantTile';

const VideoGrid = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  background-color: ${props => props.theme.palette.dark};
`;

interface RoomVideoGridProps {
  participants: Participant[];
}

export const RoomVideoGrid: React.FC<RoomVideoGridProps> = ({ participants }) => {
  return (
    <VideoGrid>
      {participants.map((participant) => (
        <ParticipantTile key={participant.id} participant={participant} />
      ))}
    </VideoGrid>
  );
};
