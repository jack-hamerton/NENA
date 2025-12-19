
import { Outlet, Link } from 'react-router-dom';
import { CssBaseline, Box, IconButton, Tooltip, Typography } from '@mui/material';
import styled from 'styled-components';
import FloatingNav from '../layout/FloatingNav';
import ScreenshotBlocker from '../layout/ScreenshotBlocker';
import AIAssistant from '../components/AIAssistant';
import NotificationBar from '../components/NotificationBar';
import { Chat } from '../rooms/Chat';

const MainContainer = styled.div`
  background-color: ${props => props.theme.background};
  min-height: 100vh;
  position: relative;
`;

const ContentContainer = styled.main`
  padding: 24px;
`;

const TopRightContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
`;

const MainLayout = () => {
  const localParticipant = { id: '1', name: 'John Doe' };
  return (
    <MainContainer>
      <CssBaseline />
      <ScreenshotBlocker />
      <FloatingNav />
      <TopRightContainer>
        <NotificationBar />
        <Tooltip title="Calendar">
          <IconButton color="inherit" component={Link} to="/calendar">
            <Typography>Calendar</Typography>
          </IconButton>
        </Tooltip>
        <AIAssistant />
      </TopRightContainer>
      <ContentContainer>
        <Outlet />
        <Chat channelId="general" localParticipant={localParticipant} />
      </ContentContainer>
    </MainContainer>
  );
};

export default MainLayout;
