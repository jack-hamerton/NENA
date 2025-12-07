import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { xiaoGenshin } from '../theme/xiaoGenshin';

const HeaderContainer = styled.header`
  background-color: ${xiaoGenshin.background};
  padding: 1rem;
  border-bottom: 1px solid ${xiaoGenshin.accent1};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
`;

const StyledNavLink = styled(NavLink)`
  color: ${xiaoGenshin.text};
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 5px;

  &.active {
    background-color: ${xiaoGenshin.accent1};
    color: ${xiaoGenshin.background};
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <StyledNavLink to="/">Feed</StyledNavLink>
        <StyledNavLink to="/discover">Discover</StyledNavLink>
        <StyledNavLink to="/profile/me">Profile</StyledNavLink>
        <StyledNavLink to="/messages">Messages</StyledNavLink>
        <StyledNavLink to="/rooms">Rooms</StyledNavLink>
        <StyledNavLink to="/study">Study</StyledNavLink>
        <StyledNavLink to="/music">Music</StyledNavLink>
        <StyledNavLink to="/podcasts">Podcasts</StyledNavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
