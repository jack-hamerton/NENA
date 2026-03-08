
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, TextField, Button, IconButton, Alert } from '@mui/material';
import { PhotoCamera, Videocam, Close } from '@mui/icons-material';

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
  max-height: 90vh;
  overflow-y: auto;

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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MediaUploadContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const MediaPreviewContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.palette.dark};
  margin: 1rem 0;
`;

const MediaPreview = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  display: block;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  display: block;
`;

const RemoveMediaButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const CharCounter = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.text.secondary};
  text-align: right;
`;

const CreatePostModal = ({ open, onClose, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [mediaPreview, setMediaPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setError('Please write something before posting');
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreatePost({ content: postContent, media, mediaType });
      setPostContent('');
      setMedia(null);
      setMediaType(null);
      setMediaPreview(null);
      setError(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setMedia(file);
      setMediaType('image');
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }

      // Check file size (limit to ~150MB for 5-minute video)
      if (file.size > 150 * 1024 * 1024) {
        setError('Video file is too large. Maximum size is 150MB.');
        return;
      }

      // Check video duration (basic check)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 300) { // 5 minutes
          setError('Video is too long. Please choose a video under 5 minutes.');
          setMedia(null);
          setMediaType(null);
          setMediaPreview(null);
        } else {
          setMedia(file);
          setMediaType('video');
          setError(null);
          
          const reader = new FileReader();
          reader.onload = (e) => setMediaPreview(e.target.result);
          reader.readAsDataURL(file);
        }
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaType(null);
    setMediaPreview(null);
    setError(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <Title>Create a Post</Title>
        {error && <Alert severity="error">{error}</Alert>}
        
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
        <CharCounter>{postContent.length}/250</CharCounter>

        {mediaPreview && (
          <MediaPreviewContainer>
            {mediaType === 'image' ? (
              <MediaPreview src={mediaPreview} alt="Preview" />
            ) : (
              <VideoPreview controls>
                <source src={mediaPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </VideoPreview>
            )}
            <RemoveMediaButton
              size="small"
              onClick={handleRemoveMedia}
              title="Remove media"
            >
              <Close />
            </RemoveMediaButton>
          </MediaPreviewContainer>
        )}

        <MediaUploadContainer>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            title="Upload image"
          >
            <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
            <PhotoCamera />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="upload video"
            component="label"
            title="Upload video (max 5 minutes)"
          >
            <input hidden accept="video/*" type="file" onChange={handleVideoUpload} />
            <Videocam />
          </IconButton>
        </MediaUploadContainer>

        <PostButton
          onClick={handleCreatePost}
          variant="contained"
          disabled={!postContent.trim() || isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </PostButton>
      </ModalContainer>
    </Modal>
  );
};

export default CreatePostModal;
