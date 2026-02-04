
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  ${up('md')} {
    flex-direction: row;
  }
`;

export const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent content from overflowing */
`;

export const VideoContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

export const Sidebar = styled.div`
  width: 100%;
  background-color: ${props => props.theme.palette.primary};
  border-top: 1px solid ${props => props.theme.palette.dark};
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  &.open {
    transform: translateY(0);
  }

  ${up('md')} {
    width: 320px;
    flex-shrink: 0;
    position: static;
    transform: none;
    border-top: none;
    border-left: 1px solid ${props => props.theme.palette.dark};
  }
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.palette.dark};
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  background-color: ${props => (props.active ? props.theme.palette.accent : 'transparent')};
  color: ${props => props.theme.text.primary};
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${props => props.theme.palette.secondary};
  }
`;

export const SidebarContent = styled.div`
  flex-grow: 1;
  overflow: auto;
`;

export const ToggleSidebarButton = styled.button`
  position: fixed;
  bottom: 80px; /* Adjust as needed */
  right: 20px;
  background-color: ${props => props.theme.palette.accent};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;

  ${up('md')} {
    display: none; /* Hide on larger screens */
  }
`;
