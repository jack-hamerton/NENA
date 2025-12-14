import React, { useState, useEffect } from 'react';
import { callService } from '../services/callService';
import { RoomControls } from './RoomControls';
import { RoomVideoGrid } from './RoomVideoGrid';

export const Room = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const updateParticipants = () => {
      setParticipants(callService.getParticipants());
    };

    callService.on('participantsChanged', updateParticipants);
    updateParticipants();

    return () => {
      callService.off('participantsChanged', updateParticipants);
    };
  }, []);

  const onLeave = () => {
    callService.leaveCall();
  };

  return (
    <div>
      <RoomVideoGrid participants={participants} />
      <RoomControls onLeave={onLeave} />
    </div>
  );
};
