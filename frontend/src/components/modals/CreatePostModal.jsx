
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, TextField, Button, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.text.primary};
  margin: 0;
  text-align: center;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    background-color: ${props => props.theme.palette.dark};
    color: ${props => props.theme.text.primary};
    border-radius: 8px;
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${props => props.theme.palette.accent};
    }
  }

  .MuiInputLabel-root {
    color: ${props => props.theme.text.secondary};
  }
`;

const PostButton = styled(Button)`
  background-color: ${props => props.theme.palette.accent};
  color: ${props => props.theme.text.primary};
  font-weight: bold;
  border-radius: 9999px;

  &:hover {
    background-color: ${props => props.theme.palette.accent};
    opacity: 0.9;
  }
`;

const MediaUploadContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const CreatePostModal = ({ open, onClose, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [media, setMedia] = useState(null);

  const handleCreatePost = () => {
    onCreatePost({ content: postContent, media });
    setPostContent('');
    setMedia(null);
    onClose();
  };

  const handleMediaUpload = (event) => {
    setMedia(event.target.files[0]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <Title>Create a Post</Title>
        <StyledTextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's happening?"
          inputProps={{ maxLength: 250 }}
        />
        <MediaUploadContainer>
          <IconButton color="primary" aria-label="upload picture" component="label">
            <input hidden accept="image/*" type="file" onChange={handleMediaUpload} />
            <PhotoCamera />
          </IconButton>
        </MediaUploadContainer>
        <PostButton onClick={handleCreatePost} variant="contained">
          Post
        </PostButton>
      </ModalContainer>
    </Modal>
  );
};

export default CreatePostModal;
