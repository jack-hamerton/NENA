import React from 'react';
import styled from 'styled-components';
import { Phone, Videocam } from '@mui/icons-material';
import { IconButton } from '../common/IconButton';
import { Button } from '../common/Button';

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.background.secondary};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 1000;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const CallButton = styled(IconButton)`
  background-color: ${props => props.theme.palette.primary};
  color: white;

  &:hover {
    background-color: ${props => props.theme.palette.primaryDark};
  }
`;

const CallPopup = ({ user, onStartCall, onClose }) => {
  if (!user) {
    return null;
  }

  return (
    <PopupContainer>
      <h3>Call {user.name}</h3>
      <ButtonContainer>
        <CallButton onClick={() => onStartCall('voice')}>
          <Phone />
        </CallButton>
        <CallButton onClick={() => onStartCall('video')}>
          <Videocam />
        </CallButton>
      </ButtonContainer>
      <Button onClick={onClose} variant="outlined">Close</Button>
    </PopupContainer>
  );
};

export default CallPopup;
