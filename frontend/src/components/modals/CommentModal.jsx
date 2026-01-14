
import React from 'react';
import styled from 'styled-components';
import { Modal } from '../common/Modal';
import CommentSection from '../../comments/CommentSection';

const CommentModalContainer = styled.div`
  width: 80vw;
  max-width: 500px;
  background-color: ${props => props.theme.palette.dark};
  padding: 1rem;
  border-radius: 8px;
`;

const CommentModal = ({ open, onClose, post }) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <CommentModalContainer>
        <h3>Comments</h3>
        <CommentSection post={post} />
      </CommentModalContainer>
    </Modal>
  );
};

export default CommentModal;
