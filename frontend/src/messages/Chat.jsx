import { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import { chatService, Message } from '../services/chatService';
import { useSnackbar } from '../context/SnackbarContext';
import { PinLock } from '../components/PinLock';
import CallPopup from '../components/call/CallPopup';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [locked, setLocked] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [callUser, setCallUser] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Establish E2EE session when the component mounts
    const establishE2EESession = async () => {
      try {
        // In a real application, you would get the recipient's identity and pre-keys from a server
        const recipientId = 'some-recipient-id';
        const recipientIdentityKey = null; // Fetch from server
        const recipientPreKey = null; // Fetch from server
        await chatService.establishSession(recipientId, recipientIdentityKey, recipientPreKey);
        showSnackbar('E2EE session established', 'success');
      } catch (error) {
        showSnackbar('Failed to establish E2EE session', 'error');
        console.error(error);
      }
    };

    establishE2EESession();

    // Get initial messages
    chatService.getMessages('some-room').then(setMessages);

    // Subscribe to new messages
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      showSnackbar(`New message from ${message.sender.name}`, 'success');
    };

    chatService.onNewMessage(handleNewMessage);

    // Cleanup subscription
    return () => {
      chatService.offNewMessage();
    };
  }, [showSnackbar]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      chatService.sendMessage({ 
        text: newMessage, 
        sender: { id: 'me', name: 'Me' },
       }).then(sentMessage => {
        setMessages(prevMessages => [...prevMessages, sentMessage]);
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
