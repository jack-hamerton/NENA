import { Outlet } from 'react-router-dom';
import LeftNav from './LeftNav';
import SplashScreen from './SplashScreen/TransitionAnimation';
import ScreenshotBlocker from './ScreenshotBlocker';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${(props) => props.theme.background};
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MainLayout = () => {
  return (
    <AppContainer>
      <SplashScreen />
      <ScreenshotBlocker />
      <LeftNav />
      <MainContent>
        <Outlet />
      </MainContent>
    </AppContainer>
  );
};

export default MainLayout;
