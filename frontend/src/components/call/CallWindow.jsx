
import React, { useEffect, useRef, useState } from 'react';
import { webRTCService } from '../../services/webRTCService';

const CallWindow = ({ call, onHangUp }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const handleTrack = (stream) => {
      setRemoteStream(stream);
    };

    if (call.type === 'incoming') {
      webRTCService.handleOffer(call.offer, handleTrack).then(answer => {
        // Send the answer back to the caller
      });
    } else {
      webRTCService.startCall(call.to, handleTrack);
    }

    webRTCService.getLocalStream().then(stream => {
        setLocalStream(stream);
    });

    return () => {
      webRTCService.hangUp();
    };
  }, [call]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="call-window">
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
      <button onClick={onHangUp}>Hang Up</button>
    </div>
  );
};

export default CallWindow;
