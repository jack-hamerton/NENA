
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const ParticipantGate = () => {
  const [uniqueCode, setUniqueCode] = useState('');
  const navigate = useNavigate();

  const handleAccessStudy = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/studies/code/${uniqueCode}`);
      if (response.ok) {
        const study = await response.json();
        navigate(`/study/participant/${study.id}`);
      } else {
        console.error('Study not found');
      }
    } catch (error) {
      console.error('Error fetching study:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Participate in a Study
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Enter Unique Code"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAccessStudy} sx={{ mt: 2 }}>
          Access Study
        </Button>
      </Box>
    </Paper>
  );
};

export default ParticipantGate;
