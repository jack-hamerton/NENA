import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Home, Search, User, MessageSquare, Mic, BookOpen, Music, Headphones } from 'react-feather';
import NavLogo from './NavLogo';

const NavContainer = styled.nav`
  width: 250px;
  background-color: ${(props) => props.theme.primary};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavItem = styled(NavLink)`
  color: ${(props) => props.theme.text};
  text-decoration: none;
  margin: 15px 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;

  &.active {
    color: ${(props) => props.theme.secondary};
  }

  svg {
    margin-right: 15px;
  }
`;

const LeftNav = () => {
  return (
    <NavContainer>
      <NavLogo />
      <NavItem to="/" end>
        <Home />
        Feed
      </NavItem>
      <NavItem to="/discover">
        <Search />
        Discover
      </NavItem>
      <NavItem to="/profile/me">
        <User />
        Profile
      </NavItem>
      <NavItem to="/messages">
        <MessageSquare />
        Messages
      </NavItem>
      <NavItem to="/rooms">
        <Mic />
        Rooms
      </NavItem>
      <NavItem to="/study">
        <BookOpen />
        Study
      </NavItem>
      <NavItem to="/music">
        <Music />
        Music
      </NavItem>
      <NavItem to="/podcasts">
        <Headphones />
        Podcasts
      </NavItem>
    </NavContainer>
  );
};

export default LeftNav;
