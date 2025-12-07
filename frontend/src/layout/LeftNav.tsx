import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageSquare, Mic, Users, BookOpen, Music } from 'react-feather';

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  width: 240px;
  background-color: ${({ theme }) => theme.background};
  border-right: 1px solid ${({ theme }) => theme.accent2};
  padding: 20px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: background-color 0.2s;

  &.active {
    background-color: ${({ theme }) => theme.accent1};
  }

  &:hover {
    background-color: ${({ theme }) => theme.accent2};
  }
`;

const IconWrapper = styled.div`
  margin-right: 15px;
`;

export const LeftNav = () => {
  return (
    <NavContainer>
      <NavItem to="/" end>
        <IconWrapper><Home /></IconWrapper>
        Home
      </NavItem>
      <NavItem to="/discover">
        <IconWrapper><Compass /></IconWrapper>
        Discover
      </NavItem>
      <NavItem to="/messages">
        <IconWrapper><MessageSquare /></IconWrapper>
        Messages
      </NavItem>
      <NavItem to="/rooms">
        <IconWrapper><Users /></IconWrapper>
        Rooms
      </NavItem>
      <NavItem to="/study">
        <IconWrapper><BookOpen /></IconWrapper>
        Study
      </NavItem>
      <NavItem to="/music">
        <IconWrapper><Music /></IconWrapper>
        Music
      </NavItem>
      <NavItem to="/podcasts">
        <IconWrapper><Mic /></IconWrapper>
        Podcasts
      </NavItem>
    </NavContainer>
  );
};
