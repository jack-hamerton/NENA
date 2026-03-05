import styled from 'styled-components';

export const RoomContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const VideoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a;
  position: relative;
`;

export const Sidebar = styled.div`
  width: 300px;
  background-color: #2d2d2d;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #404040;
  transition: transform 0.3s ease;

  &.open {
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    transform: translateX(100%);
    z-index: 1000;

    &.open {
      transform: translateX(0);
    }
  }
`;

export const TabContainer = styled.div`
  display: flex;
  background-color: #1e1e1e;
  border-bottom: 1px solid #404040;
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: ${props => props.active ? '#404040' : 'transparent'};
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #404040;
  }
`;

export const SidebarContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

export const ToggleSidebarButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-color: #404040;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1001;

  &:hover {
    background-color: #555;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;