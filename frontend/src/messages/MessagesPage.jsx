import { useState } from 'react';
import { Box, Grid, useMediaQuery, ThemeProvider } from '@mui/material';
import { theme } from '../theme/theme';
import ConversationList from './ConversationList';
import Chat from './Chat';
import AIChat from '../components/AIChat';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState('ai');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const currentUserId = 1; // This would come from auth context

  const renderChat = () => {
    if (selectedConversation === 'ai') {
      return <AIChat />;
    }
    // For other conversations, you would fetch the recipient ID etc.
    return <Chat conversationId={selectedConversation} currentUserId={currentUserId} recipientId={2} />;
  };

  if (isMobile) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ height: 'calc(100vh - 120px)', p: 1 }}>
          {selectedConversation === null ? (
            <ConversationList onSelectConversation={handleSelectConversation} />
          ) : (
            renderChat()
          )}
          {/* You would add a back button here to set selectedConversation(null) */}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: 'calc(100vh - 120px)' }}>
        <Grid item xs={4} sx={{ borderRight: '1px solid #333' }}>
          <ConversationList onSelectConversation={handleSelectConversation} />
        </Grid>
        <Grid item xs={8}>
          {renderChat()}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MessagesPage;
