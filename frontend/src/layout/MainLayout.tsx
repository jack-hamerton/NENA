
import { Outlet } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import styled from 'styled-components';
import LeftNav from '../layout/LeftNav';
import ScreenshotBlocker from '../layout/ScreenshotBlocker';
import AIAssistant from '../components/AIAssistant';
import NotificationBar from '../components/NotificationBar';

const MainContainer = styled.div`
  background-color: ${props => props.theme.background};
  min-height: 100vh;
  position: relative;
`;

const ContentContainer = styled.main`
  margin-left: 240px; /* Same as LeftNav width */
  padding: 24px;
`;

const TopRightContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
`;

const MainLayout = ({ children }) => {
  return (
    <MainContainer>
      <CssBaseline />
      <ScreenshotBlocker />
      <LeftNav />
      <TopRightContainer>
        <NotificationBar />
        <AIAssistant />
      </TopRightContainer>
      <ContentContainer>
        {children}
        <Outlet />
      </ContentContainer>
    </MainContainer>
  );
};

export default MainLayout;
