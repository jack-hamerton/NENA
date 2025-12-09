
import React, { useRef, useEffect } from 'react';

interface ScreenShareTileProps {
  stream: MediaStream;
}

export const ScreenShareTile: React.FC<ScreenShareTileProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};
