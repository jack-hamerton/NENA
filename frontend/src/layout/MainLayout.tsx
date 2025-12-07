import styled from 'styled-components';
import LeftNav from './LeftNav';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  flex-grow: 1;
  overflow-y: auto;
`;

const MainLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <LeftNav />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;
