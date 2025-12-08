import { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

interface Message {
  id: number;
  text: string;
  sender: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'Me',
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <Box>
      <Typography variant="h5">Chat</Typography>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText primary={message.text} secondary={message.sender} />
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
    </Box>
  );
};

export default Chat;
