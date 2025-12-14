import React from 'react';
import { Participant } from '../services/callService';
import { ParticipantTile } from './ParticipantTile';

interface RoomVideoGridProps {
  participants: Participant[];
}

export const RoomVideoGrid: React.FC<RoomVideoGridProps> = ({ participants }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
      {participants.map((participant) => (
        <ParticipantTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
};