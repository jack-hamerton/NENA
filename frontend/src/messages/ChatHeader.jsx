
import React from 'react';
import { AppBar, Toolbar, Avatar, Typography, IconButton } from '@mui/material';
import { Call } from '@mui/icons-material';
import styled from 'styled-components';

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ChatHeader = ({ conversation, onStartCall, sessionId }) => {
  if (!conversation) return null;

  return (
    <AppBar position="static" color="default">
      <StyledToolbar>
        <UserInfo>
          <Avatar src={conversation.avatar} alt={conversation.name} style={{ marginRight: '15px' }} />
          <Typography variant="h6">{conversation.name}</Typography>
        </UserInfo>
        <IconButton onClick={onStartCall} disabled={!sessionId}>
          <Call />
        </IconButton>
      </StyledToolbar>
    </AppBar>
  );
};

export default ChatHeader;
