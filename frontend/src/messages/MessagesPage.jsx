import { Box, Typography } from '@mui/material';
import Chat from './Chat';

const MessagesPage = () => {
  // In a real application, these values would be dynamic
  const conversationId = 1;
  const currentUserId = 1;
  const recipientId = 2;

  return (
    <Box>
      <Typography variant="h4">Messages</Typography>
      <Chat 
        conversationId={conversationId} 
        currentUserId={currentUserId} 
        recipientId={recipientId} 
      />
    </Box>
  );
};

export default MessagesPage;
