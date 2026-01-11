
import { useState, useEffect, useRef, useCallback } from 'react';
import { webRTCService } from '../services/webRTCService';
import { socket } from '../services/socket';

const useCall = () => {
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    const handleNewOffer = ({ offer, from }) => {
      console.log('Incoming call from', from);
      setIncomingCall({ from, offer, type: 'video' }); // Assuming video call for now
    };

    socket.on('webrtc-offer', handleNewOffer);

    return () => {
      socket.off('webrtc-offer', handleNewOffer);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (call) {
      timer = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(timer);
  }, [call]);

  const handleTrack = useCallback((stream) => {
    if (userVideo.current) {
      userVideo.current.srcObject = stream;
    }
  }, []);

  const startCall = useCallback(async (type, user) => {
    const callData = { type, user, initiator: true, status: 'connecting' };
    setCall(callData);
    await webRTCService.startCall(user.id, handleTrack);
    if (myVideo.current) {
      myVideo.current.srcObject = webRTCService.localStream;
    }
    setCall(prev => ({...prev, status: 'connected'}))
  }, [handleTrack]);

  const endCall = useCallback(() => {
    webRTCService.hangUp();
    setCall(null);
    setIncomingCall(null);
    setIsScreenSharing(false);
    if(myVideo.current) myVideo.current.srcObject = null;
    if(userVideo.current) userVideo.current.srcObject = null;
  }, []);

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;

    const callData = { ...incomingCall, initiator: false, status: 'connecting' };
    setCall(callData);
    const answer = await webRTCService.handleOffer(incomingCall.offer, handleTrack);
    socket.emit('webrtc-answer', { answer, to: incomingCall.from });
    setIncomingCall(null);
    if (myVideo.current) {
      myVideo.current.srcObject = webRTCService.localStream;
    }
    setCall(prev => ({...prev, status: 'connected'}))
  }, [incomingCall, handleTrack]);

  const rejectCall = useCallback(() => {
    // In a real app, you might want to send a 'reject' signal
    setIncomingCall(null);
  }, []);

  const toggleMute = useCallback(() => {
    const stream = webRTCService.localStream;
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(prev => !prev);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = webRTCService.localStream;
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(prev => !prev);
      // Disabling screen sharing if camera is turned off
      if(isScreenSharing) {
        toggleScreenSharing();
      }
    }
  }, [isScreenSharing]);

  const toggleScreenSharing = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing and revert to camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      webRTCService.replaceTrack(stream.getVideoTracks()[0]);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      webRTCService.localStream = stream;
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      webRTCService.replaceTrack(stream.getVideoTracks()[0]);
       if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      webRTCService.localStream = stream;
      setIsScreenSharing(true);
      setIsCameraOff(false); // Screen sharing implies video is on
    }
  }, [isScreenSharing]);

  return { call, incomingCall, startCall, endCall, acceptCall, rejectCall, myVideo, userVideo, isMuted, toggleMute, isCameraOff, toggleCamera, callTimer, isScreenSharing, toggleScreenSharing };
};

export default useCall;
