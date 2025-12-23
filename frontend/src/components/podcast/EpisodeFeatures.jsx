
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const NotesContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${theme.palette.dark};
  border-radius: 4px;

  h4 {
    margin-bottom: 0.5rem;
    color: ${theme.text.primary};
  }

  p {
    color: ${theme.text.secondary};
  }
`;

const EpisodeFeatures = ({ notes }) => {
  if (!notes) {
    return null;
  }

  return (
    <NotesContainer>
      <h4>Episode Notes</h4>
      <p>{notes}</p>
    </NotesContainer>
  );
};

export default EpisodeFeatures;
