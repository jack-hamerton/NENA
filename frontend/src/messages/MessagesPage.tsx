import { Box, Typography } from '@mui/material';
import Chat from './Chat';

const MessagesPage = () => {
  return (
    <Box>
      <Typography variant="h4">Messages</Typography>
      <Chat />
    </Box>
  );
};

export default MessagesPage;
