
import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { Phone, Videocam } from '@mui/icons-material';

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.background};
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
  background-color: ${props => props.theme.primary};
  color: white;

  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;

const CallPopup = ({ user, on-start-call, on-close }) => {
  if (!user) {
    return null;
  }

  return (
    <PopupContainer>
      <h3>Call {user.name}</h3>
      <ButtonContainer>
        <CallButton onClick={() => on-start-call('voice')}>
          <Phone />
        </CallButton>
        <CallButton onClick={() => on-start-call('video')}>
          <Videocam />
        </CallButton>
      </ButtonContainer>
      <button onClick={onClose}>Close</button>
    </PopupContainer>
  );
};

export default CallPopup;
