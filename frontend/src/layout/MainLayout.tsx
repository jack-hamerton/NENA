import styled from 'styled-components';
import { LeftNav } from './LeftNav';
import { Outlet } from 'react-router-dom';
import { ScreenshotBlocker } from './ScreenshotBlocker';

const MainLayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

export const MainLayout = () => {
  return (
    <ScreenshotBlocker>
      <MainLayoutContainer>
        <LeftNav />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainLayoutContainer>
    </ScreenshotBlocker>
  );
};
