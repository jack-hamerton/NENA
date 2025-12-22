
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, TextField, Button } from '@mui/material';

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: ${props => props.theme.palette.dark};
  border: 2px solid #000;
  box-shadow: 24;
  padding: 1rem;
`;

const CreatePostModal = ({ open, onClose, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');

  const handleCreatePost = () => {
    onCreatePost(postContent);
    setPostContent('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <h2>Create Post</h2>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <Button onClick={handleCreatePost} variant="contained" color="primary">
          Post
        </Button>
      </ModalContainer>
    </Modal>
  );
};

export default CreatePostModal;
