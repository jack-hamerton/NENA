import React from 'react';
import { ParticipantTile } from './ParticipantTile';
import { ScreenShareTile } from './ScreenShareTile';
import { ControlsBar } from './ControlsBar';
import './RoomVideoGrid.css';

interface Participant {
  id: string;
  name: string;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

interface RoomVideoGridProps {
  participants: Participant[];
  localParticipant: Participant;
}

export const RoomVideoGrid: React.FC<RoomVideoGridProps> = ({ participants, localParticipant }) => {
  const screenSharer = participants.find(p => p.isScreenSharing);

  return (
    <div className="room-video-grid">
      <div className="main-view">
        {screenSharer ? (
          <ScreenShareTile participant={screenSharer} />
        ) : (
          <ParticipantTile participant={participants.find(p => p.isSpeaking) || localParticipant} />
        )}
      </div>
      <div className="participant-grid">
        {participants.map(participant => (
          <ParticipantTile key={participant.id} participant={participant} />
        ))}
      </div>
      <ControlsBar />
    </div>
  );
};
