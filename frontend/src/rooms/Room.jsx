
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom'; // To get the room ID from the URL
import { callService } from '../services/callService';
import { RoomControls } from './RoomControls';
import { RoomVideoGrid } from './RoomVideoGrid';

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.palette.dark};
`;

const VideoContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LocalVideo = styled.video`
    width: 200px;
    height: 150px;
    border: 2px solid ${props => props.theme.palette.primary.main};
    border-radius: 8px;
    position: absolute;
    bottom: 90px; /* Above the controls */
    right: 20px;
`;

export const Room = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    // Handler for when the local stream is available
    const handleLocalStream = (stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
    };

    // Handler for when the participant list changes
    const handleParticipantsChanged = (updatedParticipants) => {
      setParticipants(updatedParticipants);
    };

    // Subscribe to events from the call service
    callService.onLocalStream = handleLocalStream;
    callService.onParticipantsChanged = handleParticipantsChanged;

    // Join the call
    callService.joinCall(roomId);

    // Clean up on component unmount
    return () => {
      callService.leaveCall();
      callService.onLocalStream = null;
      callService.onParticipantsChanged = null;
    };
  }, [roomId]); // Re-run the effect if the room ID changes

  return (
    <RoomContainer>
      <VideoContainer>
        <RoomVideoGrid participants={participants} />
        {localStream && (
            <LocalVideo ref={localVideoRef} autoPlay muted playsInline />
        )}
      </VideoContainer>
      <RoomControls onLeave={() => callService.leaveCall()} />
    </RoomContainer>
  );
};
