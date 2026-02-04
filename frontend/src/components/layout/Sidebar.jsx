
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaCompass, FaBook, FaPodcast, FaCalendarAlt, FaUsers, FaEnvelope, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 0 10px 10px 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease-in-out;

  // PC styles
  @media (min-width: 769px) {
    left: ${props => props.isOpen ? '0' : '-120px'};
  }

  // Mobile styles
  @media (max-width: 768px) {
    transform: none;
    top: 0;
    height: 100%;
    border-radius: 10px 0 0 10px;
    left: auto;
    right: ${props => props.isOpen ? '0' : '-120px'};
    width: 100px;
    padding: 20px;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.text.primary};
  text-decoration: none;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;

  &:hover {
    color: ${props => props.theme.accent};
  }

  svg {
    margin-bottom: 5px;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.text.primary};
  cursor: pointer;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;

  &:hover {
    color: ${props => props.theme.accent};
  }

  svg {
    margin-bottom: 5px;
  }
`;

const Backdrop = styled.div`
  display: ${props => props.isOpen && props.isMobile ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
`;

export const Sidebar = ({ isOpen, setOpen }) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50;

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth > 768 && isOpen) {
        // If we resize to desktop, and the mobile menu was open, keep it open.
        setOpen(true);
    } else if (window.innerWidth <= 768 && isOpen) {
        // If we resize to mobile, and the desktop menu was open, keep it open
        setOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, setOpen]);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    // Only start swipe gesture if the touch is near the edge of the screen
    if (e.targetTouches[0].clientX > 50 && e.targetTouches[0].clientX < window.innerWidth - 50) {
        return;
    }
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !touchStartX.current) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isMobile || !touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (!isOpen && isLeftSwipe) {
      setOpen(true);
    } else if (isOpen && isRightSwipe) {
      setOpen(false);
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isMobile, setOpen]);

  const closeSidebar = () => {
      if(isMobile) {
          setOpen(false);
      }
  }

  return (
    <>
      <Backdrop isOpen={isOpen} isMobile={isMobile} onClick={() => setOpen(false)} />
      <SidebarContainer isOpen={isOpen}>
        <NavLink to="/home" onClick={closeSidebar}><FaHome size={24} />Home</NavLink>
        <NavLink to="/discover" onClick={closeSidebar}><FaCompass size={24} />Discover</NavLink>
        <NavLink to="/study" onClick={closeSidebar}><FaBook size={24} />Study</NavLink>
        <NavLink to="/podcasts" onClick={closeSidebar}><FaPodcast size={24} />Podcasts</NavLink>
        <NavLink to="/calendar" onClick={closeSidebar}><FaCalendarAlt size={24} />Calendar</NavLink>
        <NavLink to="/room" onClick={closeSidebar}><FaUsers size={24} />Room</NavLink>
        <NavLink to="/messages" onClick={closeSidebar}><FaEnvelope size={24} />Messages</NavLink>
        {user && <NavLink to={`/profile/${user.id}`} onClick={closeSidebar}><FaUser size={24} />Profile</NavLink>}
        {user && <NavLink to={`/user/${user.id}/settings`} onClick={closeSidebar}><FaCog size={24} />Settings</NavLink>}
        {user && <LogoutButton onClick={() => { logout(); closeSidebar(); }}><FaSignOutAlt size={24} />Logout</LogoutButton>}
      </SidebarContainer>
    </>
  );
};
