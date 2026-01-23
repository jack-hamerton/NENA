
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  width: 100%;
  height: 100%;
`;

const ParticipantContainer = styled.div`
  position: relative;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserIdLabel = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const ParticipantVideo = ({ participant }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && participant.stream) {
            videoRef.current.srcObject = participant.stream;
        }
    }, [participant.stream]);

    return (
        <ParticipantContainer>
            <Video ref={videoRef} autoPlay playsInline />
            <UserIdLabel>{participant.userId}</UserIdLabel>
        </ParticipantContainer>
    );
};

export const RoomVideoGrid = ({ participants }) => {
  return (
    <GridContainer>
      {participants.map((participant) => (
        <ParticipantVideo key={participant.userId} participant={participant} />
      ))}
    </GridContainer>
  );
};
