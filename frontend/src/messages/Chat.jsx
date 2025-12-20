
import { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import { chatService, Message } from '../services/chatService';
import { useSnackbar } from '../context/SnackbarContext';
import { PinLock } from '../components/PinLock';
import CallPopup from '../components/call/CallPopup';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [locked, setLocked] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [callUser, setCallUser] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    chatService.getMessages('some-room').then(setMessages);

    const handleNewMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      showSnackbar(`New message from ${message.sender.name}`, 'success');
    };

    chatService.on('new-message', handleNewMessage);

    return () => {
      chatService.off('new-message', handleNewMessage);
    };
  }, [showSnackbar]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      chatService.sendMessage({ 
        text: newMessage, 
        sender: { id: 'me', name: 'Me' },
        // In a real app, the sender would be the logged in user.
       });
      setNewMessage('');
    }
  };

  const handleUnlock = () => {
    setLocked(false);
  };
  
  const handleUserClick = (user) => {
    setCallUser(user);
    setShowCallPopup(true);
  };
  
    const handleStartCall = (callType) => {
    console.log(`Starting ${callType} call with ${callUser.name}`);
    setShowCallPopup(false);
  };

  if (locked) {
    return <PinLock onUnlock={handleUnlock} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Chat</Typography>
		    <Box>
          <IconButton onClick={() => handleUserClick({name: "User"})}>
            <Typography>Call</Typography>
          </IconButton>
          <IconButton onClick={() => setLocked(true)}>
            <Typography>Lock</Typography>
          </IconButton>
		</Box>
      </Box>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText primary={message.text} secondary={message.sender.name} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
      {showCallPopup && <CallPopup user={callUser} onStartCall={handleStartCall} onClose={() => setShowCallPopup(false)} />}
    </Box>
  );
};

export default Chat;
