
import React from 'react';
import StudyBuilder from '../study/StudyBuilder';
import StudyParticipantView from '../study/StudyParticipantView';
import StudyList from '../study/StudyList';
import { Container, Typography, Box } from '@mui/material';

const StudyPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Study Page
      </Typography>

      <Box sx={{ mb: 6 }}>
        <StudyList />
      </Box>

      <Box sx={{ mb: 6 }}>
        <StudyParticipantView />
      </Box>
      
      <Box>
        <StudyBuilder />
      </Box>

    </Container>
  );
};

export default StudyPage;
