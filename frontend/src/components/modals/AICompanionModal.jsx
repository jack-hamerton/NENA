
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import AIChat from '../../components/AIChat';
import { theme } from '../../theme/theme';
import { Modal, Paper } from '@mui/material';

const ModalContent = styled(Paper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.palette.background.paper};
  border: 2px solid #000;
  box-shadow: 24;
  outline: none;
`;

const AICompanionModal = ({ open, onClose }) => {
  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <ModalContent theme={theme}>
          <AIChat />
        </ModalContent>
      </Modal>
    </ThemeProvider>
  );
};

export default AICompanionModal;
