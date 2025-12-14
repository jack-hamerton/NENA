import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const StudyPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Welcome to the Study Center
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Choose an option below to either create a new research study or participate in an existing one.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
        <Button variant="contained" color="primary" component={Link} to="/study/new" size="large">
          Create a New Study
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/study/access" size="large">
          Participate in a Study
        </Button>
      </Box>
    </Paper>
  );
};

export default StudyPage;
