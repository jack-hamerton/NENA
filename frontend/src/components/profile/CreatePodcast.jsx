
import React, { useState } from 'react';
import styled from 'styled-components';
import { createPodcast } from '../../services/podcast.service';
import { theme } from '../../theme/theme';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.palette.dark};
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  color: ${theme.text.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${theme.palette.light};
  background: ${theme.palette.dark};
  color: ${theme.text.primary};
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${theme.palette.light};
  background: ${theme.palette.dark};
  color: ${theme.text.primary};
  min-height: 100px;
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  background: ${theme.palette.primary};
  color: white;
  cursor: pointer;

  &:hover {
    background: ${theme.palette.secondary};
  }
`;

const CreatePodcast = ({ show, onClose }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('notes', notes);
    formData.append('recommendations', recommendations);
    formData.append('file', file);

    try {
      await createPodcast(formData);
      onClose();
    } catch (error) {
      console.error('Error creating podcast:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Create New Podcast</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Podcast Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextArea
            placeholder="Episode Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <TextArea
            placeholder="Host Recommendations..."
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
          />
          <Input
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <Button type="submit">Post Podcast</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreatePodcast;
