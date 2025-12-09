import { Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import styled from 'styled-components';
import LeftNav from './LeftNav';
import ScreenshotBlocker from './ScreenshotBlocker';
import AIAssistant from '../components/AIAssistant';

const MainContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  min-height: 100vh;
`;

const ContentContainer = styled.main`
  flex-grow: 1;
  padding: 24px;
`;

const MainLayout = () => {
  return (
    <MainContainer>
      <CssBaseline />
      <ScreenshotBlocker />
      <LeftNav />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      <AIAssistant />
    </MainContainer>
  );
};

export default MainLayout;
