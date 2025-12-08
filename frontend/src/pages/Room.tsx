import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';

const Room = () => {
  const { roomId } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const localVideoRef = useRef(null);

  useEffect(() => {
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing media devices:', err));

    // Clean up stream on component unmount
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    }
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Room: {roomId}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <video ref={localVideoRef} autoPlay playsInline muted={isMuted} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }} />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color={isMuted ? 'secondary' : 'primary'} onClick={toggleMute}>
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button variant="contained" color={isCameraOff ? 'secondary' : 'primary'} onClick={toggleCamera}>
              {isCameraOff ? 'Start Video' : 'Stop Video'}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          {/* Participant list will go here */}
          <Typography variant="h6">Participants</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Room;
