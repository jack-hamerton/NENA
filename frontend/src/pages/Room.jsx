import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, TextField, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import { Send, AddReaction, RemoveCircleOutline } from '@mui/icons-material';
import { chatService } from '../services/chatService';
import { roomService } from '../services/roomService';
import { useAuth } from '../hooks/useAuth';

const Room = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const localVideoRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRoom = async () => {
      const roomDetails = await roomService.getRoomById(roomId);
      setRoom(roomDetails);
      setParticipants(roomDetails.participants);
    }
    fetchRoom();

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing media devices:', err));

    roomService.joinRoom(roomId);

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserJoined = (user) => {
      setParticipants((prevParticipants) => [...prevParticipants, user]);
    }

    const handleUserLeft = (user) => {
      setParticipants((prevParticipants) => prevParticipants.filter(p => p.id !== user.id));
    }

    chatService.on('new-message', handleNewMessage);
    roomService.on('user-joined-room', handleUserJoined);
    roomService.on('user-left-room', handleUserLeft);

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      roomService.leaveRoom(roomId);
      chatService.off('new-message', handleNewMessage);
      roomService.off('user-joined-room', handleUserJoined);
      roomService.off('user-left-room', handleUserLeft);
    };
  }, [roomId]);

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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        sender: {
          id: user.id,
          name: user.username,
        },
        roomId,
      };
      chatService.sendMessage(messageData);
      setNewMessage('');
    }
  };

  const handleRemoveUser = async (userId) => {
    await roomService.removeUserFromRoom(roomId, userId);
    // The user-left-room event should be triggered and handle the participant list update
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Room: {room ? room.name : roomId}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                <video ref={localVideoRef} autoPlay playsInline muted style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }} />
              </Box>
            </Grid>
            {participants.filter(p => p.id !== user.id).map(p => (
              <Grid item xs={4} key={p.id}>
                <Paper sx={{p: 1, backgroundColor: '#2c2c2c'}}>
                  <video autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
                  <Typography align="center">{p.username}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#2c2c2c', borderRadius: '8px' }}>
            <Box sx={{p: 2}}>
              <Typography variant="h6">Participants</Typography>
              <List dense>
                {participants.map(p => (
                  <ListItem key={p.id}>
                    <ListItemText primary={p.username} />
                    {room && room.creatorId === user.id && p.id !== user.id && (
                      <IconButton size="small" onClick={() => handleRemoveUser(p.id)}>
                        <RemoveCircleOutline fontSize="small" sx={{color: 'grey'}}/>
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid grey' }}>
              <Typography variant="h6">Chat</Typography>
              <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={msg.text} 
                      secondary={msg.sender.name} 
                      primaryTypographyProps={{ style: { color: 'white', wordBreak: 'break-word' } }}
                      secondaryTypographyProps={{ style: { color: 'grey' } }}
                    />
                    <IconButton size="small">
                      <AddReaction fontSize="small" sx={{ color: 'grey' }} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'grey',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                    },
                    input: { color: 'white' }
                  }}
                />
                <IconButton onClick={handleSendMessage} sx={{ ml: 1 }}>
                  <Send sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Room;
