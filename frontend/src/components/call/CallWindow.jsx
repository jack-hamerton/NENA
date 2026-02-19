
import React, { useState, useEffect, useRef } from 'react';
import { Paper, IconButton, Typography, Grid } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, CallEnd } from '@mui/icons-material';
import styled from 'styled-components';
import { chatService } from '../../services/chatService';

const CallWindowContainer = styled(Paper)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 900px;
  height: 80vh;
  background-color: #2c2c2c;
  z-index: 2000;
  display: flex;
  flex-direction: column;
`;

const VideoGrid = styled.div`
  flex-grow: 1;
  position: relative;
`;

const LocalVideo = styled.video`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 25%;
  max-width: 200px;
  border-radius: 8px;
  background: #000;
`;

const RemoteVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
`;

const ControlsContainer = styled(Grid)`
  padding: 16px;
  background-color: #333;
`;

const CallWindow = ({ activeCall, onHangUp }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(activeCall.callType === 'voice');
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initWebRTC = async () => {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: activeCall.callType === 'video',
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = event => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current.onicecandidate = event => {
        if (event.candidate) {
          chatService.sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate,
            to: activeCall.to,
          });
        }
      };

      if (activeCall.type === 'outgoing') {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        chatService.sendSignalingMessage({
          type: 'call-offer',
          offer,
          to: activeCall.to,
          from: chatService.getCurrentUser().id,
          callType: activeCall.callType,
        });
      }
    };

    initWebRTC();

    const handleSignaling = (message) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      switch (message.type) {
        case 'call-offer':
          if(activeCall.type === 'incoming'){
            pc.setRemoteDescription(new RTCSessionDescription(message.offer)).then(async () => {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              chatService.sendSignalingMessage({
                type: 'call-answer',
                answer,
                to: message.from,
              });
            });
          }
          break;
        case 'call-answer':
          pc.setRemoteDescription(new RTCSessionDescription(message.answer));
          break;
        case 'ice-candidate':
          pc.addIceCandidate(new RTCIceCandidate(message.candidate));
          break;
        case 'hang-up':
          handleHangUp();
          break;
        default:
          break;
      }
    };
    
    chatService.on('signaling-message', handleSignaling);

    return () => {
      chatService.off('signaling-message', handleSignaling);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if(localVideoRef.current && localVideoRef.current.srcObject){
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeCall, onHangUp]);

  const handleToggleMute = () => {
    localVideoRef.current.srcObject.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const handleToggleVideo = () => {
    localVideoRef.current.srcObject.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsVideoOff(!track.enabled);
    });
  };
  
  const handleHangUp = () => {
    chatService.sendSignalingMessage({ type: 'hang-up', to: activeCall.to });
    onHangUp();
  };


  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <CallWindowContainer elevation={10}>
      <VideoGrid>
        <RemoteVideo ref={remoteVideoRef} autoPlay playsInline />
        <LocalVideo ref={localVideoRef} autoPlay playsInline muted />
      </VideoGrid>
      <ControlsContainer container justifyContent="center" alignItems="center">
        <Typography variant="body1">{formatDuration(duration)}</Typography>
        <IconButton onClick={handleToggleMute}>
          {isMuted ? <MicOff /> : <Mic />}
        </IconButton>
        <IconButton onClick={handleToggleVideo}>
          {isVideoOff ? <VideocamOff /> : <Videocam />}
        </IconButton>
        <IconButton style={{ color: 'red' }} onClick={handleHangUp}>
          <CallEnd />
        </IconButton>
      </ControlsContainer>
    </CallWindowContainer>
  );
};

export default CallWindow;
