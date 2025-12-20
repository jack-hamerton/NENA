import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from '../components/UserAvatar';
import { darkTheme } from '../theme';

const NavContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
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

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
`;

const AvatarContainer = styled(Link)`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${darkTheme.palette.primary.main};
  padding: 2px; // To create the ring effect
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FloatingNav = () => {
  const { user } = useAuth();

  return (
    <NavContainer>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        <NavLink to="/room">Room</NavLink>
        <NavLink to="/study">Study</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        {user ? (
          <AvatarContainer to="/profile">
            <UserAvatar user={user} />
          </AvatarContainer>
        ) : (
          <NavLink to="/profile">Profile</NavLink>
        )}
      </NavLinks>
    </NavContainer>
  );
};

export default FloatingNav;
