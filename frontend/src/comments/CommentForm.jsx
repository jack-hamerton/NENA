
import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@mui/material';

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: ${props => (props.isReply ? '0.5rem' : '0')};
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    background-color: ${props => props.theme.palette.dark};
    color: ${props => props.theme.text.primary};
    border-radius: 9999px; /* Pill shape */
    padding: 0.5rem 1rem;
    font-size: 0.9rem;

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${props => props.theme.palette.accent};
    }
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 9999px;
  background-color: ${props => props.theme.palette.accent};

  &:hover {
    background-color: ${props => props.theme.palette.accent};
    opacity: 0.9;
  }
`;

const CommentForm = ({ postId, onCommentSubmit, isReply = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onCommentSubmit({ text });
      setText('');
    }
  };

  return (
    <Form onSubmit={handleSubmit} isReply={isReply}>
      <StyledTextField
        fullWidth
        variant="outlined"
        size="small"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isReply ? "Write a reply..." : "Add a comment..."}
      />
      <SubmitButton type="submit" variant="contained">
        Post
      </SubmitButton>
    </Form>
  );
};

export default CommentForm;
