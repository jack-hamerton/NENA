import { useState, useEffect, useRef } from 'react';

const useCall = () => {
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    let timer;
    if (call && call.status === 'connected') {
      timer = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }

    return () => clearInterval(timer);
  }, [call]);

  // Simulate connection time
  useEffect(() => {
    if (call && call.status === 'connecting') {
      const timer = setTimeout(() => {
        setCall(prev => ({ ...prev, status: 'connected' }));
      }, 2000); // 2-second connection delay

      return () => clearTimeout(timer);
    }
  }, [call]);


  const startCall = (type, user) => {
    const newCall = { type, user, initiator: true, status: 'connecting' };
    setCall(newCall);
    navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
      .then(stream => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Failed to get media', err);
      });
  };

  const endCall = () => {
    setCall(null);
    setIncomingCall(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsScreenSharing(false);
  };

  const acceptCall = () => {
    const newCall = { ...incomingCall, status: 'connecting' };
    setCall(newCall);
    setIncomingCall(null);
     navigator.mediaDevices.getUserMedia({ video: newCall.type === 'video', audio: true })
      .then(stream => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Failed to get media', err);
      });
  }

  const rejectCall = () => {
      setIncomingCall(null);
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleRemoteMute = () => {
      setIsRemoteMuted(!isRemoteMuted);
  }

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(!isCameraOff);
      if(isScreenSharing) {
        toggleScreenSharing();
      }
    }
  };

  const toggleScreenSharing = () => {
      if(!isCameraOff) {
        setIsScreenSharing(!isScreenSharing);
      }
  }

  // Mock receiving a call
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!call && !incomingCall) {
        setIncomingCall({ type: 'video', user: { name: 'Jane Smith' } });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [call, incomingCall]);

  // Mock remote user toggling mute
  useEffect(() => {
      if(call && call.status === 'connected') {
          const randomInterval = Math.random() * 5000 + 5000; // between 5 and 10 seconds
          const timer = setInterval(() => {
              toggleRemoteMute();
          }, randomInterval);

          return () => clearInterval(timer);
      }
  }, [call]);

  return { call, incomingCall, startCall, endCall, acceptCall, rejectCall, myVideo, userVideo, isMuted, toggleMute, isCameraOff, toggleCamera, callTimer, isScreenSharing, toggleScreenSharing, isRemoteMuted };
};

export default useCall;
