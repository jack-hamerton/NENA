
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const TranscriptionContainer = styled.div`
  margin-top: 2rem;
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

const Transcription = ({ transcription }) => {
  if (!transcription) {
    return null;
  }

  return (
    <TranscriptionContainer>
      <h4>Transcription</h4>
      <p>{transcription}</p>
    </TranscriptionContainer>
  );
};

export default Transcription;
