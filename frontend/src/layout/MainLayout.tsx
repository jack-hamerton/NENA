import styled from 'styled-components';
import LeftNav from './LeftNav';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.background};
`;

const MainContent = styled.main`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
`;

export const MainLayout = () => {
  return (
    <LayoutContainer>
      <LeftNav />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};
