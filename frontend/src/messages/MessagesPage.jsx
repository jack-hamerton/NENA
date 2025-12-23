
import { Box, Typography } from '@mui/material';
import Chat from './Chat';
import styled from 'styled-components';

const StyledMessagesPage = styled(Box)`
  background-color: ${(props) => props.theme.palette.dark};
  color: ${(props) => props.theme.text.primary};
  height: 100vh;
  padding: 20px;
`;

const MessagesPage = () => {
  // In a real application, these values would be dynamic
  const conversationId = 1;
  const currentUserId = 1;
  const recipientId = 2;

  return (
    <StyledMessagesPage>
      <Typography variant="h4">Messages</Typography>
      <Chat 
        conversationId={conversationId} 
        currentUserId={currentUserId} 
        recipientId={recipientId} 
      />
    </StyledMessagesPage>
  );
};

export default MessagesPage;
