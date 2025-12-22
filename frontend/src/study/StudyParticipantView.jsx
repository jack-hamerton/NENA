
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const StudyParticipantView = () => {
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/studies/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStudy(data);
        } else {
          console.error('Failed to fetch study');
        }
      } catch (error) {
        console.error('Error fetching study:', error);
      }
    };

    fetchStudy();
  }, [id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/studies/${id}/answers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: Object.values(answers) }),
        }
      );
      if (response.ok) {
        console.log('Answers submitted successfully');
        // Optionally, redirect to a thank you page
      } else {
        console.error('Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {study.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        {study.description}
      </Typography>
      {study.questions.map((question) => (
        <Box key={question.id} sx={{ mb: 2 }}>
          <Typography variant="h6">{question.text}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            margin="normal"
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit Answers
      </Button>
    </Paper>
  );
};

export default StudyParticipantView;
