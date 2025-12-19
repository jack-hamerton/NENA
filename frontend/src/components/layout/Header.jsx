import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  padding: 20px;
  background-color: ${props => props.theme.background};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.textColor};
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <h1>Nena</h1>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/podcasts">Podcasts</NavLink>
        <NavLink to="/discover">Discover</NavLink>
      </Nav>
    </HeaderContainer>
  );
};
