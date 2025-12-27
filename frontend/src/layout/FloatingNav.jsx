
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from '../components/UserAvatar';
import NotificationBar from '../components/NotificationBar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const NavContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  background-color: transparent;
  padding: 20px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: ${props => props.theme.text.primary};
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 10px;

  &.active {
    background-color: ${props => props.theme.palette.accent};
  }
`;

const IconLink = styled(RouterNavLink)`
  color: ${props => props.theme.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    color: ${props => props.theme.palette.accent};
  }
`;

const AvatarContainer = styled(RouterNavLink)`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.palette.secondary};
  padding: 2px; // To create the ring effect
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.active {
    border-color: ${props => props.theme.palette.accent};
  }
`;

const FloatingNav = () => {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return null;
  }

  return (
    <NavContainer theme={theme}>
      <NavLinks>
        <IconLink to={`/user/${user.id}/settings`} theme={theme}>
          <MoreHorizIcon />
        </IconLink>

        <NavLink to="/" theme={theme} exact>
          Home
        </NavLink>
        <NotificationBar />
        <NavLink to="/discover" theme={theme}>
          Discover
        </NavLink>
        <NavLink to="/messages" theme={theme}>
          Messages
        </NavLink>
        <NavLink to="/room" theme={theme}>
          Room
        </NavLink>
        <NavLink to="/podcasts" theme={theme}>
          Podcasts
        </NavLink>
        <NavLink to="/study" theme={theme}>
          Study
        </NavLink>
        <NavLink to="/calendar" theme={theme}>
          Calendar
        </NavLink>
        
        <AvatarContainer to={`/profile/${user.id}`} theme={theme}>
          <UserAvatar user={user} />
        </AvatarContainer>
      </NavLinks>
    </NavContainer>
  );
};

export default FloatingNav;
