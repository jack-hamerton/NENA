
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
  width: 100%;
  padding-bottom: 75%; // 4:3 aspect ratio
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoVideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c2c2c;
  color: #fff;
`;

const NameLabel = styled.div`
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
            {participant.stream ? (
                <Video ref={videoRef} autoPlay playsInline muted />
            ) : (
                <NoVideoPlaceholder>
                    <p>{participant.name}'s video is off</p>
                </NoVideoPlaceholder>
            )}
            <NameLabel>{participant.name || participant.userId}</NameLabel>
        </ParticipantContainer>
    );
};

export const RoomVideoGrid = ({ participants }) => {
  return (
    <GridContainer>
      {participants.map((participant) => (
        <ParticipantVideo key={participant.id || participant.userId} participant={participant} />
      ))}
    </GridContainer>
  );
};
