
import { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import styled from 'styled-components';
import { chatService } from '../services/chatService';
import { useSnackbar } from '../context/SnackbarContext';
import { PinLock } from '../components/PinLock';
import CallPopup from '../components/call/CallPopup';
import { realtimeService } from '../services/realtimeService';

const StyledChat = styled(Box)`
  background-color: ${(props) => props.theme.palette.dark};
  color: ${(props) => props.theme.text.primary};
  height: 100%;
  padding: 1rem;
`;

const StyledMessages = styled(List)`
  color: ${(props) => props.theme.text.primary};
  background-color: ${(props) => props.theme.palette.primary};
  margin-bottom: 1rem;
  border-radius: 5px;
`;

const StyledMessageInputContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: ${(props) => props.theme.text.primary};
  }
  .MuiInputLabel-root {
    color: ${(props) => props.theme.text.secondary};
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${(props) => props.theme.palette.secondary};
    }
    &:hover fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
    &.Mui-focused fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
  }
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary};
  color: ${(props) => props.theme.text.primary};

  &:hover {
    background-color: ${(props) => props.theme.palette.accent};
  }
`;

const Chat = ({ conversationId, currentUserId, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [locked, setLocked] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [callUser, setCallUser] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const establishE2EESession = async () => {
      try {
        await chatService.establishSession(recipientId, null, null);
        showSnackbar('E2EE session established', 'success');
      } catch (error) {
        showSnackbar('Failed to establish E2EE session', 'error');
        console.error(error);
      }
    };

    establishE2EESession();

    realtimeService.connect(currentUserId);

    chatService.getMessages(conversationId).then(setMessages);

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      showSnackbar(`New message from ${message.sender.name}`, 'success');
    };

    chatService.onNewMessage(handleNewMessage);

    return () => {
      chatService.offNewMessage();
      realtimeService.disconnect();
    };
  }, [conversationId, currentUserId, recipientId, showSnackbar]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      chatService.sendMessage({ 
        content: newMessage, 
        sender_id: currentUserId,
        recipient_id: recipientId,
        conversation_id: conversationId
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
    <StyledChat>
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
      <StyledMessages>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText primary={message.content} secondary={message.sender.name} />
          </ListItem>
        ))}
      </StyledMessages>
      <StyledMessageInputContainer>
        <StyledTextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <StyledButton variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>
          Send
        </StyledButton>
      </StyledMessageInputContainer>
      {showCallPopup && <CallPopup user={callUser} onStartCall={handleStartCall} onClose={() => setShowCallPopup(false)} />}
    </StyledChat>
  );
};

export default Chat;
