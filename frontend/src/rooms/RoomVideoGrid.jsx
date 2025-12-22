import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const VideoGrid = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Video = ({ stream, muted }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <VideoContainer>
      <StyledVideo ref={ref} autoPlay playsInline muted={muted} />
    </VideoContainer>
  );
};

export const RoomVideoGrid = ({ localStream, remoteStreams }) => {
  return (
    <VideoGrid>
      {localStream && <Video stream={localStream} muted={true} />}
      {Object.entries(remoteStreams).map(([clientId, stream]) => (
        <Video key={clientId} stream={stream} muted={false} />
      ))}
    </VideoGrid>
  );
};
