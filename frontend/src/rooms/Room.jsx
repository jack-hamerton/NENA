
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { callService } from '../services/callService';
import { RoomControls } from './RoomControls';
import { RoomVideoGrid } from './RoomVideoGrid';

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.palette.dark};
`;

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
    <RoomContainer>
      <RoomVideoGrid participants={participants} />
      <RoomControls onLeave={onLeave} />
    </RoomContainer>
  );
};
