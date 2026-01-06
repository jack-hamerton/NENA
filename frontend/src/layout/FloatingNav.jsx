
import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.isOpen ? '0' : '-100%')};
  width: 70%;
  height: 100%;
  background-color: ${props => props.theme.palette.background.paper};
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease-in-out;
  z-index: 1000;
  padding: 2rem;
`;

const NavItem = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.text.primary};
  font-size: 1.2rem;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.palette.dark};

  &:hover {
    background-color: ${props => props.theme.palette.dark};
  }
`;

const FloatingNav = ({ isOpen, feedType, setFeedType, handleRestart, setCreatePostModalOpen }) => {
  return (
    <NavContainer isOpen={isOpen}>
      <NavItem onClick={() => { setFeedType('for-you'); }}>For You</NavItem>
      <NavItem onClick={() => { setFeedType('following'); }}>Following</NavItem>
      <NavItem onClick={handleRestart}>Restart</NavItem>
      <NavItem onClick={() => setCreatePostModalOpen(true)}>Create Post</NavItem>
    </NavContainer>
  );
};

export default FloatingNav;
